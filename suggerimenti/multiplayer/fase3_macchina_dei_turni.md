# Fase 3 (Multiplayer): La Macchina dei Turni e il Verdetto del Banco

Questa è la fase più importante: coordinare il gioco sequenziale da sinistra a destra e fare in modo che il banco sfidi tutti i giocatori.

---

## 1. Il Flusso di una Mano al Tavolo

Il flusso del Blackjack multiplayer segue una sequenza rigidissima:

```text
[1. DISTRIBUZIONE] ──> [2. TURNO GIOCATORE 1] ──> [3. TURNO GIOCATORE 2] ──> [4. TURNO BANCO] ──> [5. VERDETTO FINALE]
```

### 1. La Distribuzione Iniziale:
Il croupier distribuisce 2 carte a ogni giocatore seduto al tavolo, e 2 carte per sé (con la prima coperta).  
Controlla subito chi ha fatto Blackjack Naturale: chi ha 21 iniziale si ferma già lì!

### 2. La Ruota dei Turni (`indiceTurno`):
Il server imposta `indiceTurno = 0` (tocca al Giocatore 1).
* **Controllo di Sicurezza Ferreo:**  
  Se il Giocatore 2 clicca "Chiama", il server lo ignora! Solo il socket che corrisponde a `giocatori[indiceTurno].id` ha il permesso di muovere.
* **Cosa fa avanzare il turno?**
  * Il giocatore preme **"Stai"**: il suo turno finisce $\rightarrow$ il server fa `indiceTurno++`.
  * Il giocatore **sballa (supera 21)**: il suo turno finisce automaticamente $\rightarrow$ il server fa `indiceTurno++`.
* **Saltare i giocatori inattivi:**  
  Se il giocatore successivo ha già fatto Blackjack al primo giro, il server salta automaticamente al giocatore dopo!

---

## 2. Il Turno del Banco

Quando il turno supera l'ultimo giocatore (`indiceTurno >= tavolo.giocatori.length`):
1. **Tutti i giocatori hanno terminato.**
2. Il banco svela la sua carta coperta.
3. Se almeno un giocatore al tavolo è ancora in gioco (non hanno sballato tutti), il banco esegue il suo ciclo `while` pescando fino ad arrivare ad almeno 17.

---

## 3. Il Verdetto Individuale per Ogni Sedia

A differenza del singolo giocatore, nel multiplayer **ogni sedia ha la sua sfida personale contro il banco**:
* Il Giocatore 1 potrebbe aver fatto 19 $\rightarrow$ **Vince** contro il 18 del banco.
* Il Giocatore 2 potrebbe aver sballato a 22 $\rightarrow$ **Perde**.
* Il Giocatore 3 potrebbe aver fatto 18 $\rightarrow$ **Pareggia (Push)** con il 18 del banco.

Il server confronta il punteggio del banco con quello di ciascun giocatore e assegna a ogni sedia il proprio esito specifico (`VITTORIA`, `SCONFITTA`, `PAREGGIO`, `BLACKJACK`).

---

## 4. Checklist Mentale per la Fase 3
* [ ] Distribuire 2 carte a ciascun giocatore presente al tavolo all'inizio della mano.
* [ ] Implementare la variabile `indiceTurno` per abilitare le azioni solo al giocatore attivo.
* [ ] Creare la logica di avanzamento automatico del turno su "Stai" o su sballo.
* [ ] Far partire il turno del banco solo quando tutti i giocatori hanno concluso la loro mano.
* [ ] Calcolare il risultato finale separatamente per ciascuna sedia e inviare il verdetto a tutto il tavolo (`io.emit`).

