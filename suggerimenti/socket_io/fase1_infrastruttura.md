# Fase 1: Architettura di Rete e Primo "Handshake"

Questa guida è pensata per farti comprendere da zero cosa succede quando due computer (il tuo Browser e un Server Node.js) si parlano in tempo reale.

---

## 1. Il Concetto Chiave: HTTP vs WebSockets (Socket.io)

### Come ha funzionato il tuo gioco fino ad ora:
Fino a questo momento, la tua app è stata un'applicazione "a pagina singola" (SPA). Quando apri il browser, Vite invia il codice HTML, CSS e JS. Da quel momento in poi, il browser lavora completamente da solo, isolato dal mondo.

### Come funziona una connessione normale (HTTP):
Nel web classico (chiamate API `fetch` o `axios`):
1. Il client fa una domanda al server (*Request*).
2. Il server risponde (*Response*).
3. **La connessione si chiude immediatamente.**  
Se il server ha una nuova informazione (es. "un altro giocatore è entrato al tavolo"), non può avvisare il client, a meno che il client non chieda continuamente *"Ci sono novità?"* (polling).

### La magia di WebSockets e Socket.io:
Socket.io apre un **canale di comunicazione bidirezionale persistente** (chiamato tunnel TCP):
* Il client bussa alla porta del server una sola volta.
* La porta **resta sempre aperta**.
* Sia il client che il server possono inviarsi messaggi all'istante, in qualsiasi millisecondo, con latenza quasi zero.

---

## 2. L'Architettura del Progetto: Dove vive il Server?

Attualmente hai solo una cartella `src` con il codice React.  
L'approccio più pulito per iniziare è creare un'architettura **a due stanze** dentro lo stesso progetto:

```text
blackjack/
├── server/           <-- IL NUOVO SERVER (Node.js + Socket.io)
│   ├── package.json  <-- Le dipendenze solo per il backend
│   └── server.js     <-- Il file di avvio del croupier
│
├── src/              <-- IL TUO CLIENT (React + Vite)
│   ├── App.jsx
│   └── ...
├── package.json      <-- Le dipendenze del frontend
```

---

## 3. Pacchetti da Conoscere

Per realizzare questa fase serviranno due pacchetti diversi (uno per stanza):

### Nella cartella `server/`:
1. **`express`** (o il modulo `http` nativo): serve per creare il server web che ascolterà su una porta (ad esempio la porta `3001`).
2. **`socket.io`**: la libreria del server che gestisce i tunnel di connessione e gli eventi in tempo reale.
3. **`cors`**: uno strumento fondamentale per la sicurezza del browser.

> ### ⚠️ Il concetto del CORS (Cross-Origin Resource Sharing):
> Il tuo React gira su `http://localhost:5173`.  
> Il tuo server Node girerà su `http://localhost:3001`.  
> I browser, per motivi di sicurezza, bloccano le comunicazioni tra porte diverse (origini diverse). La libreria `cors` dice esplicitamente al server Node: *"Permetti al client sulla porta 5173 di parlarmi senza bloccarlo"*.

### Nella cartella principale (React):
1. **`socket.io-client`**: la libreria gemella per il browser che sa come connettersi e dialogare con il server.

---

## 4. L'Obiettivo della Fase 1: Il "Primo Saluto" (Handshake)

Prima di pensare al mazzo, alle carte o alle regole del Blackjack, l'obiettivo di questa fase è solo verificare che i due computer riescano a stringersi la mano.

### La sequenza di verifica:
1. **Avvio Server:** Avvii il server Node.js nel terminale sulla porta 3001 (vedrai ad esempio `Server in ascolto sulla porta 3001`).
2. **Connessione del Client:** Quando il componente React si monta (`useEffect`), il client invia una richiesta di connessione a `http://localhost:3001`.
3. **L'evento di sistema `connection`:**
   * Socket.io ha un evento integrato chiamato `connection`.
   * Quando il client si connette, il server esegue una funzione e stampa nel suo terminale: *"Un giocatore si è connesso con ID: [codice_univoco]"*.
4. **La disconnessione (`disconnect`):**
   * Se ricarichi la pagina o chiudi la scheda del browser, il server rileva l'evento `disconnect` e stampa: *"Il giocatore si è disconnesso"*.

---

## 5. Checklist Mentale per la Fase 1
* [x] Creare la cartella `server` e inizializzare un `package.json` dedicato (`npm init -y`).
* [x] Installare `express`, `socket.io` e `cors` dentro `server`.
* [x] Impostare il server per ascoltare su una porta dedicata (es. 3001).
* [x] Configurare il CORS per autorizzare la porta del tuo frontend Vite (`5173`).
* [x] Installare `socket.io-client` nella cartella di React.
* [x] Verificare che nei terminali compaiano i log di avvenuta connessione e disconnessione.

