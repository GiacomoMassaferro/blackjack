// 1. IMPORT DELLE DIPENDENZE
import express from "express";          // Framework web minimale per Node.js
import { Server } from "socket.io";      // Gestore dei canali WebSocket bidirezionali
import cors from "cors";                // Permette a domini/porte diverse di comunicare (React -> Node)
import { createServer } from "http";    // Server HTTP nativo di Node (necessario a Socket.io)

// 2. CONFIGURAZIONE DELL'APPLICAZIONE
const app = express();
const port = 3001;

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

// 3. GESTIONE DEI CANALI DI COMUNICAZIONE
// Scatta ogni volta che un browser apre il tunnel di connessione
io.on('connection', (socket) => {
    // 'socket' è l'oggetto del singolo giocatore connesso, identificato dal suo socket.id
    console.log("Un giocatore si è connesso:", socket.id);

    // Scatta automaticamente quando il giocatore chiude la pagina o si disconnette
    socket.on('disconnect', () => {
        console.log("Giocatore disconnesso:", socket.id);
    });
});

// 4. AVVIO IN ASCOLTO SULLA PORTA
httpServer.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
