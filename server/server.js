// 1. IMPORT DELLE DIPENDENZE
import express from "express";          // Framework web minimale per Node.js
import { Server } from "socket.io";      // Gestore dei canali WebSocket bidirezionali
import cors from "cors";                // Permette a domini/porte diverse di comunicare (React -> Node)
import { createServer } from "http";    // Server HTTP nativo di Node (necessario a Socket.io)
import calcolaPunteggio from "../src/utility/calcolaPunteggio.js";
import nuovoMazzo from "../src/utility/nuovoMazzo.js";
import { STATO_GIOCO, messaggiEsito } from "../src/utility/statiGioco.js";

// 2. CONFIGURAZIONE DELL'APPLICAZIONE
const app = express();
const port = 3001;

// MEMORIA DELLE PARTITE IN CORSO:
// Una Map che associa ogni 'socket.id' (giocatore) al rispettivo stato di gioco (mazzo, mani, punteggi)
const partite = new Map();

// Abilita CORS per le normali richieste HTTP di Express
app.use(cors());

// Creiamo il server HTTP incapsulando Express
const httpServer = createServer(app);

// Creiamo l'istanza di Socket.io agganciandola al server HTTP e autorizzando React
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // L'indirizzo del nostro frontend Vite
        methods: ["GET", "POST"]
    }
});

// 3. FUNZIONE HELPER: FILTRO ANTI-CHEAT E TRASMISSIONE DATI (PRINCIPIO DRY)
// Evita di riscrivere le stesse 15 righe in tutti gli ascoltatori.
// Prende la partita dal server, nasconde le carte segrete se la partita è in corso e invia i dati al client.
function inviaStatoTavolo(socket, partita) {
    const inCorso = partita.statoGioco === STATO_GIOCO.IN_CORSO;

    // Filtro carte banco: se la partita è in corso nascondiamo la prima carta con '🂠', altrimenti le mostriamo tutte
    const carteBancoVisibili = inCorso
        ? [{ card: "🂠", value: 0 }, partita.dealerHand[1]]
        : partita.dealerHand;

    // Filtro punteggio banco: se in corso mostriamo "?", se finita mostriamo il punteggio reale calcolato
    const punteggioBancoVisibile = inCorso
        ? "?"
        : calcolaPunteggio(partita.dealerHand);

    // Inviamo il pacchetto filtrato al singolo giocatore
    socket.emit('tavolo:aggiornato', {
        carteGiocatore: partita.playerHand,
        punteggioGiocatore: calcolaPunteggio(partita.playerHand),
        carteBanco: carteBancoVisibili,
        punteggioBanco: punteggioBancoVisibile,
        numeroCarteMazzo: partita.deck.length,
        statoGioco: partita.statoGioco
    });
}

// 4. GESTIONE DEI CANALI DI COMUNICAZIONE
io.on('connection', (socket) => {
    console.log("Un giocatore si è connesso:", socket.id);

    // Pulizia della memoria: eliminiamo la partita per evitare memory leak quando il client chiude la pagina
    socket.on('disconnect', () => {
        console.log("Giocatore disconnesso:", socket.id);
        partite.delete(socket.id);
    });

    // 1. Il giocatore avvia o riavvia la partita
    socket.on('partita:inizia', () => {
        console.log("Richiesta nuova partita da:", socket.id);

        // A. Mescolamento e distribuzione delle prime 4 carte
        const mazzo = nuovoMazzo();
        const manoDealer = [mazzo.pop(), mazzo.pop()];
        const manoGiocatore = [mazzo.pop(), mazzo.pop()];
        const punteggioDealer = calcolaPunteggio(manoDealer);
        const punteggioGiocatore = calcolaPunteggio(manoGiocatore);
        let statoGioco = STATO_GIOCO.IN_CORSO;

        // B. Controllo del Blackjack Naturale all'avvio (4 scenari possibili)
        if (punteggioDealer === 21 && punteggioGiocatore === 21) {
            statoGioco = STATO_GIOCO.PAREGGIO;
        } else if (punteggioGiocatore === 21) {
            statoGioco = STATO_GIOCO.BLACKJACK;
        } else if (punteggioDealer === 21) {
            statoGioco = STATO_GIOCO.SCONFITTA;
        }

        // C. Salvataggio della partita nella memoria Map del server
        const nuovaPartita = {
            deck: mazzo,
            dealerHand: manoDealer,
            playerHand: manoGiocatore,
            statoGioco: statoGioco
        };
        partite.set(socket.id, nuovaPartita);

        // D. Invio del tavolo tramite la nostra funzione helper DRY
        inviaStatoTavolo(socket, nuovaPartita);
    });

    // 2. Il giocatore chiede una carta aggiuntiva
    socket.on('giocatore:chiama', () => {
        const partita = partite.get(socket.id);
        if (!partita || partita.statoGioco !== STATO_GIOCO.IN_CORSO) return;

        // Peschiamo la carta dal mazzo del server e la aggiungiamo alla mano del giocatore
        const cartaPescata = partita.deck.pop();
        partita.playerHand.push(cartaPescata);

        // Se supera 21, il giocatore sballa
        const punteggio = calcolaPunteggio(partita.playerHand);
        if (punteggio > 21) {
            partita.statoGioco = STATO_GIOCO.PLAYER_SBALLATO;
        }

        // Inviamo il tavolo aggiornato tramite la funzione helper DRY
        inviaStatoTavolo(socket, partita);
    });

    // 3. Il giocatore si ferma e passa il turno al banco
    socket.on('giocatore:sta', () => {
        const partita = partite.get(socket.id);
        if (!partita || partita.statoGioco !== STATO_GIOCO.IN_CORSO) return;

        // Il banco estrae carte finché non raggiunge almeno 17 punti
        let punteggioDealer = calcolaPunteggio(partita.dealerHand);
        while (punteggioDealer < 17 && partita.deck.length > 0) {
            const cartaPescata = partita.deck.pop();
            partita.dealerHand.push(cartaPescata);
            punteggioDealer = calcolaPunteggio(partita.dealerHand);
        }

        // Calcolo del verdetto finale
        const punteggioGiocatore = calcolaPunteggio(partita.playerHand);
        if (punteggioDealer > 21) {
            partita.statoGioco = STATO_GIOCO.DEALER_SBALLATO;
        } else if (punteggioDealer > punteggioGiocatore) {
            partita.statoGioco = STATO_GIOCO.SCONFITTA;
        } else if (punteggioDealer < punteggioGiocatore) {
            partita.statoGioco = STATO_GIOCO.VITTORIA;
        } else {
            partita.statoGioco = STATO_GIOCO.PAREGGIO;
        }

        // Inviamo il tavolo finale (la funzione helper svelerà automaticamente la carta coperta del banco!)
        inviaStatoTavolo(socket, partita);
    });
});

// 5. AVVIO IN ASCOLTO SULLA PORTA
httpServer.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
