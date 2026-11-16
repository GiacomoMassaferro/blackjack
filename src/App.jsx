import { io } from 'socket.io-client'; // 1. IMPORT DEL CLIENT SOCKET.IO E DELLE DIPENDENZE REACT
import { useState } from 'react';
import { useEffect } from 'react';
import { STATO_GIOCO, messaggiEsito } from './utility/statiGioco';
import nuovoMazzo from './utility/nuovoMazzo';
import VisualizzaMano from './components/hand';
import calcolaPunteggio from './utility/calcolaPunteggio';
import './App.css';

// 2. INIZIALIZZAZIONE DELLA CONNESSIONE WEBSOCKET
// IMPORTANTE: Dichiariamo il socket FUORI dal componente App().
// In questo modo la connessione viene creata una sola volta al caricamento del file,
// evitando che React apra una nuova connessione a ogni singolo re-render dell'interfaccia.
const socket = io("http://localhost:3001");

function App() {
  // STATI LOCALI DELL'INTERFACCIA (Ricevuti dal Server)
  const [playerHand, setPlayerHand] = useState([]);          // Array carte del giocatore
  const [dealerHand, setDealerHand] = useState([]);          // Array carte del banco (con eventuale carta coperta '🂠')
  const [punteggioPlayer, setPunteggioPlayer] = useState(0); // Punteggio calcolato dal server per il giocatore
  const [punteggioDealer, setPunteggioDealer] = useState("?"); // Punteggio del banco ("?" se coperto, numero se finita)
  const [deckcount, setDeckCount] = useState(0);             // Numero di carte rimanenti nel mazzo del server
  const [statoGioco, setStatoGioco] = useState(STATO_GIOCO.IN_CORSO); // Stato della partita gestito dal server

  useEffect(() => {
    // 1. ASCOLTO (Setup): riceve il pacchetto dati inviato dal server
    socket.on('tavolo:aggiornato', (dati) => {
      setPlayerHand(dati.carteGiocatore);
      setPunteggioPlayer(dati.punteggioGiocatore);
      setDealerHand(dati.carteBanco);
      setPunteggioDealer(dati.punteggioBanco);
      setDeckCount(dati.numeroCarteMazzo);
      setStatoGioco(dati.statoGioco);
    });

    // 2. TRASMISSIONE (Emit): chiediamo al server di avviare la prima mano all'avvio
    socket.emit('partita:inizia');

    // 3. PULIZIA (Cleanup): stacchiamo l'ascoltatore quando il componente si smonta per evitare memory leak
    return () => {
      socket.off('tavolo:aggiornato');
    };
  }, []);

  // AZIONI DEL GIOCATORE (Ora inviano solo segnali al server, zero logica pesante nel browser!)
  function chiamaCarta() {
    socket.emit('giocatore:chiama');
  }

  function stay() {
    socket.emit('giocatore:sta');
  }

  function nuovaPartita() {
    socket.emit('partita:inizia');
  }

  return (
    <div className="casino-app">
      <header className="casino-header">
        <h1>♠ Blackjack Royale ♥</h1>
        <div className="deck-counter">
          Carte nel mazzo: <span>{deckcount}</span>
        </div>
      </header>

      <main className="blackjack-table">
        {/* Sezione Banco */}
        <section className="hand-area dealer-area">
          <div className="area-info">
            <h2>BANCO</h2>
            <div className="score-pill">
              Punteggio: <strong>{punteggioDealer}</strong>
            </div>
          </div>
          <div className="cards-row">
            {VisualizzaMano(dealerHand, statoGioco === STATO_GIOCO.IN_CORSO)}
          </div>
        </section>

        {/* Banner Esito Partita */}
        {messaggiEsito[statoGioco] && (
          <div className="outcome-banner">
            <h2>{messaggiEsito[statoGioco]}</h2>
          </div>
        )}

        {/* Sezione Giocatore */}
        <section className="hand-area player-area">
          <div className="area-info">
            <h2>GIOCATORE</h2>
            <div className="score-pill">
              Punteggio: <strong>{punteggioPlayer}</strong>
            </div>
          </div>
          <div className="cards-row">
            {VisualizzaMano(playerHand, false)}
          </div>
        </section>

        {/* Pulsantiera di Gioco */}
        <footer className="table-controls">
          <button
            className="action-btn hit-btn"
            onClick={chiamaCarta}
            disabled={statoGioco !== STATO_GIOCO.IN_CORSO}
          >
            Chiama Carta
          </button>

          <button
            className="action-btn stand-btn"
            onClick={stay}
            disabled={statoGioco !== STATO_GIOCO.IN_CORSO}
          >
            Stai
          </button>

          {statoGioco !== STATO_GIOCO.IN_CORSO && (
            <button className="action-btn replay-btn" onClick={nuovaPartita}>
              Nuova Partita
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
