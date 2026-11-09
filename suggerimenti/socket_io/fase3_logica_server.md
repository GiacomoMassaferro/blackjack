# Fase 3: La Logica di Gioco sul Server (Il Vero Croupier)

In questa fase trasformerai il server Node.js nel banco del casinò, riutilizzando tutte le funzioni matematiche e algoritmiche che hai già scritto con successo.

---

## 1. Riutilizzare le Tue Utility sul Server

La notizia migliore è che **hai già scritto l'80% della logica!**
I tuoi file:
* `nuovoMazzo.js` (algoritmo di mescolamento Fisher-Yates)
* `calcolaPunteggio.js` (riduzione intelligente degli Assi da 11 a 1)
* `statiGioco.js` (la macchina a stati finiti)

...sono funzioni JavaScript pure. Possono essere importate ed eseguite su Node.js esattamente come facevi su React.

> ### 💡 Suggerimento di compatibilità:
> Per usare la sintassi moderna `import / export` anche sul server Node, ricordati di inserire `"type": "module"` nel `package.json` della cartella `server/`.

---

## 2. La Gestione della Memoria per Singolo Giocatore (`socket.id`)

In React avevi `useState` per tenere in memoria la mano del banco e del giocatore.  
Sul server non c'è React: come fa il server a ricordarsi le carte di ciascun giocatore connesso?

### Il concetto di `socket.id`:
Ogni volta che un browser si connette, Socket.io gli assegna un identificativo univoco (una stringa casuale, es. `xyz_123`).

Per tenere traccia delle partite in corso:
* Il server può memorizzare le partite in una struttura a chiave-valore (ad esempio una `Map` di JavaScript o un semplice oggetto).
* La **chiave** è il `socket.id` del giocatore.
* Il **valore** è lo stato della partita per quel giocatore:
  * Il suo mazzo corrente (`deck`)
  * Le sue carte (`playerHand`)
  * Le carte del banco (`dealerHand`)
  * Lo stato della partita (`statoGioco`)

---

## 3. Gestire le 3 Azioni del Giocatore sul Server

Dentro il blocco di connessione del server (`io.on('connection', socket => { ... })`), il server imposta i 3 ascoltatori:

### A. Quando riceve `partita:inizia`:
1. Chiama `nuovoMazzo()`.
2. Estrae 2 carte per il giocatore e 2 carte per il banco.
3. Verifica immediatamente il Blackjack Naturale iniziale (esattamente come facevi nella tua funzione `nuovaPartita`).
4. Salva questo stato nella memoria del server associandolo al `socket.id`.
5. Prepara il pacchetto filtrato (nascondendo la prima carta del banco se la partita è in corso).
6. Esegue `socket.emit('tavolo:aggiornato', payload)`.

### B. Quando riceve `giocatore:chiama`:
1. Recupera la partita corrispondente a questo `socket.id`.
2. Se la partita non è `IN_CORSO`, ignora la richiesta (evita trucchi da parte del client).
3. Estrae una carta dal mazzo e la aggiunge alla mano del giocatore.
4. Ricalcola il punteggio con `calcolaPunteggio`.
5. Se il giocatore ha superato 21, imposta lo stato su `PLAYER_SBALLATO`.
6. Salva la nuova situazione ed emette `socket.emit('tavolo:aggiornato', payload)`.

### C. Quando riceve `giocatore:sta`:
1. Recupera la partita dal `socket.id`.
2. Esegue il ciclo di estrazione del banco finché il punteggio del banco è inferiore a 17 (la logica che avevi in `stay()`).
3. Calcola il vincitore confrontando i punteggi finali (`VITTORIA`, `SCONFITTA`, `DEALER_SBALLATO`, `PAREGGIO`).
4. Ora che la partita è finita, prepara il pacchetto **mostrando tutte le carte del banco e il suo punteggio totale reale**.
5. Emette `socket.emit('tavolo:aggiornato', payload)`.

### D. Pulizia alla disconnessione (`disconnect`):
Quando il giocatore chiude la scheda, il server riceve `disconnect`:
* Elimina la partita associata a quel `socket.id` dalla memoria per non consumare RAM inutilmente.

---

## 4. Checklist Mentale per la Fase 3
* [ ] Copiare o condividere le utility (`nuovoMazzo`, `calcolaPunteggio`, `statiGioco`) nella cartella `server`.
* [ ] Creare una mappa in memoria per associare le partite ai `socket.id`.
* [ ] Implementare l'ascoltatore per `partita:inizia` e il calcolo del Blackjack iniziale.
* [ ] Implementare l'ascoltatore per `giocatore:chiama` con controllo dello sballo.
* [ ] Implementare l'ascoltatore per `giocatore:sta` con il ciclo del banco a 17.
* [ ] Implementare la funzione che "filtra" il tavolo prima di inviarlo al client (nascondendo la carta coperta).
* [ ] Rimuovere la partita dalla memoria quando l'utente si disconnette.

