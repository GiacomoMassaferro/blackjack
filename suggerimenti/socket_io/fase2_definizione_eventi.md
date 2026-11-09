# Fase 2: Il Protocollo di Comunicazione e gli Eventi

Questa guida spiega come progettare "il vocabolario" con cui il browser e il server si scambieranno i dati, prima ancora di scrivere la logica.

---

## 1. Il Paradigma Basato su Eventi: Parlare vs Ascoltare

In Socket.io non esistono percorsi URL (come `/api/carte`). Tutto funziona attraverso **Eventi personalizzati**.

Esistono solo due azioni fondamentali:
1. **EMIT (Parlare):** Inviare un messaggio attraverso il tunnel. Chi fa `emit` dice: *"Ehi, è successo questo evento, ed ecco i dati allegati"*.
2. **ON (Ascoltare):** Rimanere in attesa di un messaggio. Chi fa `on` dice: *"Appena ricevi questo specifico evento, esegui questa funzione con i dati ricevuti"*.

---

## 2. Definire il "Contratto" a Tavolino

Prima di toccare il codice, uno sviluppatore progetta la tabella degli eventi. Chi deve dire cosa?

### Eventi dal CLIENT al SERVER (Le intenzioni del Giocatore)
Il giocatore ha solo 3 pulsanti a schermo, quindi il client deve poter inviare solo 3 intenzioni:

1. **`partita:inizia`**:
   * *Quando scatta:* Al montaggio iniziale del gioco o quando il giocatore preme "Nuova Partita".
   * *Dati inviati:* Nessuno (il client chiede solo al banco di preparare il tavolo).
2. **`giocatore:chiama`**:
   * *Quando scatta:* Quando il giocatore clicca sul pulsante "Chiama Carta".
   * *Dati inviati:* Nessuno (il client richiede una carta al server).
3. **`giocatore:sta`**:
   * *Quando scatta:* Quando il giocatore clicca su "Stai".
   * *Dati inviati:* Nessuno (il giocatore dichiara concluso il proprio turno).

---

### Eventi dal SERVER al CLIENT (Le decisioni del Croupier)
Il server elabora le regole e rimanda al browser la fotografia della situazione:

1. **`tavolo:aggiornato`** (L'evento principale):
   * *Quando scatta:* Ogni volta che succede qualcosa (carte distribuite, carta pescata, banco che gioca, partita conclusa).
   * *Dati inviati (Payload):* Un oggetto che descrive l'intero stato visibile del tavolo.

---

## 3. Il Principio Anti-Cheat: Cosa inviare nel Payload?

Questo è il concetto più importante dell'intera architettura client-server: **la sicurezza del dato**.

### L'errore da non fare mai:
Inviare l'intero array del mazzo al client o inviare la carta coperta del banco dicendo *"nascondila tu con il CSS"*.  
Qualsiasi utente che preme `F12` e apre il tab Network o la Console potrebbe leggere la carta coperta prima di decidere se stare o chiamare!

### Il modo corretto (Payload Filtrato dal Server):
Il server deve inviare al client un oggetto strutturato così:

* **`carteGiocatore`**: la lista completa delle carte del player (es. `[{ card: "10♠", value: 10 }, ...]`).
* **`punteggioGiocatore`**: il totale dei punti del giocatore.
* **`carteBanco`**: 
  * Se la partita è ancora in corso: il server invia solo la carta scoperta e un segnaposto per quella coperta (oppure omette la seconda carta).
  * Se la partita è conclusa: il server invia tutte le carte scoperte del banco.
* **`punteggioBanco`**:
  * Se la partita è in corso: `null` o `"?"`.
  * Se la partita è finita: il punteggio totale reale del banco.
* **`statoGioco`**: il tuo fidato enum (`IN_CORSO`, `VITTORIA`, `PLAYER_SBALLATO`, ecc.).
* **`numeroCarteMazzo`**: un semplice numero (es. `48`), **non** le carte effettive del mazzo!

---

## 4. Checklist Mentale per la Fase 2
* [ ] Avere chiaro chi parla (`emit`) e chi ascolta (`on`) per ogni singola azione.
* [ ] Definire i nomi degli eventi usando una convenzione chiara (es. `soggetto:azione`).
* [ ] Disegnare sulla carta la struttura del pacchetto dati (`payload`) che il server invierà al client.
* [ ] Rispettare il principio per cui il client riceve solo ciò che ha il permesso di vedere in quel preciso momento.

