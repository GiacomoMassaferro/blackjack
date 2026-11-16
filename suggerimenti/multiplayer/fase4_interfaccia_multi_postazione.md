# Fase 4 (Multiplayer): L'Interfaccia React a più Postazioni

In questa fase trasformeremo la schermata di React per mostrare tutte le postazioni dei giocatori attorno al tavolo da gioco verde.

---

## 1. Come Cambia il Layout di `App.jsx`

Attualmente hai una sola sezione:
`<section className="hand-area player-area">`

Nel tavolo multiplayer avremo un contenitore di **postazioni multiple**:
* Un ciclo `.map()` sull'array `giocatori` ricevuto dal server:
  * Ogni giocatore avrà il suo box con il proprio nome, le sue carte e il suo punteggio.
  * In questo modo, che ci siano 1, 2 o 3 persone al tavolo, l'interfaccia disegnerà automaticamente le loro postazioni affiancate!

---

## 2. Distinguere "La Mia Sedia" dagli Avversari

Come fa il browser a sapere qual è la **tua** sedia rispetto a quella degli altri?

Grazie a `socket.id`:
* Per ogni giocatore disegnato nel ciclo `.map()`, confrontiamo:
  `giocatore.id === socket.id`
* Se è uguale: scriviamo **"TU"** accanto al nome o applichiamo un bordo speciale, così l'utente sa subito quale mano è la sua!

---

## 3. L'Indicatore Visivo del Turno (Chi deve giocare?)

Il server ti invia `indiceTurno` (es. `0` per il primo giocatore).

Nell'interfaccia:
* Quando `indiceTurno === index`, aggiungiamo alla postazione una classe CSS speciale (es. `postazione-attiva` con un bagliore dorato o un'animazione a pulsazione).
* Tutto il tavolo saprà visivamente chi sta riflettendo e di chi è il turno in quel momento!

---

## 4. La Regola d'Oro dei Pulsanti: Abilitarli solo al Tuo Turno

Questa è la magia che rende il gioco ordinato:

I bottoni "Chiama Carta" e "Stai" devono essere attivi **SOLO SE**:
1. La partita è nella fase dei turni.
2. **Tocca proprio a te!** (`giocatori[indiceTurno]?.id === socket.id`).
3. Non hai già sballato o fatto "Stai".

Se tocca a un altro giocatore, i tuoi bottoni risulteranno grigi e disabilitati. Appena tocca a te, si accendono da soli!

---

## 5. Checklist Mentale per la Fase 4
* [ ] Rimpiazzare l'area del singolo giocatore con un ciclo `.map()` che disegna tutte le postazioni al tavolo.
* [ ] Evidenziare la propria sedia confrontando l'ID con `socket.id`.
* [ ] Illuminare la postazione del giocatore che ha il turno attivo (`indiceTurno`).
* [ ] Disabilitare i pulsanti di azione quando è il turno di un altro giocatore.
* [ ] Mostrare il verdetto (Vittoria, Sconfitta, Blackjack, Pareggio) su ciascuna postazione al termine della mano.

