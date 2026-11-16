# Fase 1 (Multiplayer): La Struttura del Tavolo Condiviso

In questa fase trasformeremo la memoria del server: non più una partita isolata per ogni connessione, ma **un unico tavolo da casinò condiviso** a cui più persone possono sedersi contemporaneamente.

---

## 1. Il Salto Concettuale: Da Mappa Individuale a Tavolo Unico

### Prima (1-to-1):
Il server usava `const partite = new Map()`.  
Ogni giocatore viveva in una realtà parallela: se si connettevano due persone, il server creava due mazzi diversi e due banchi diversi che non si incrociavano mai.

### Ora (Multiplayer):
Esiste **un solo oggetto Tavolo** sul server.
* C'è **un solo mazzo** comune di carte.
* C'è **un solo banco** (dealer).
* C'è **un elenco (array) di giocatori** seduti alle varie postazioni.

---

## 2. L'Oggetto `tavolo` sul Server

Ecco la struttura mentale di cui il server ha bisogno per gestire la stanza comune:

* **`deck`**: il mazzo unico mescolato da cui pescano tutti.
* **`dealerHand`**: la mano del banco (comune a tutti).
* **`giocatori`**: una lista (Array) dove ogni elemento rappresenta una sedia:
  * `id`: il `socket.id` del giocatore.
  * `nome`: un'etichetta (es. "Giocatore 1", "Giocatore 2" o un nickname).
  * `playerHand`: le carte ricevute da quel giocatore.
  * `punteggio`: il totale punti attuale.
  * `stato`: lo stato individuale (`IN_CORSO`, `STAI`, `SBALLATO`, `BLACKJACK`, `VITTORIA`, ecc.).
* **`indiceTurno`**: un numero (0, 1, 2...) che indica quale giocatore ha la parola in questo momento.
* **`faseTavolo`**: lo stato generale del tavolo (`ATTESA_GIOCATORI`, `IN_GIOCO`, `TURNO_BANCO`, `FINE_MANO`).

---

## 3. La Sicurezza Anti-Cheat nel Multiplayer

Nel Blackjack reale, le carte degli altri giocatori sono scoperte e visibili a tutto il tavolo.  
L'unica cosa che deve rimanere segreta per tutti è la prima carta del banco!

### Come deve viaggiare il pacchetto:
Quando il server invia `tavolo:aggiornato`:
1. Manda la lista di **tutti i giocatori** con le loro carte visibili.
2. Manda le carte del banco (nascondendo la prima finché il banco non gioca il proprio turno).
3. Manda l'indice `indiceTurno`, così ogni browser sa di chi è il turno.
4. Manda il numero di carte rimaste nel mazzo.

---

## 4. Checklist Mentale per la Fase 1
* [ ] Sostituire la `Map` delle singole partite con un unico oggetto `tavolo` globale sul server.
* [ ] Definire la struttura dell'array `giocatori` per memorizzare più postazioni.
* [ ] Aggiungere la variabile per tenere traccia del turno attivo (`indiceTurno`).
* [ ] Riadattare la funzione di filtro dati affinché invii lo stato di tutte le postazioni contemporaneamente.

