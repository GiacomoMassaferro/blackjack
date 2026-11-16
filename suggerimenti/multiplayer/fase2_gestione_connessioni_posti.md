# Fase 2 (Multiplayer): Gestione delle Sedie (Join, Leave e Postazioni)

In questa fase insegneremo al server a gestire gli ingressi e le uscite dei giocatori attorno al tavolo verde.

---

## 1. La Metafora delle Sedie al Casinò

Immagina un tavolo da Blackjack fisico con un numero limitato di posti (ad esempio **3 o 4 sedie** al massimo).

### Cosa succede quando arriva un utente (`connection`):
1. **Ci sono sedie libere?**
   * **Sì:** Il server gli assegna la prima sedia vuota (es. Postazione 1), crea la sua scheda nell'array `tavolo.giocatori` e gli dà il benvenuto.
   * **No (Tavolo Pieno):** Il server lo notifica o lo mette come spettatore.
2. **Aggiornamento per tutti:**  
   Non appena un nuovo giocatore si siede, il server avvisa istantaneamente tutti gli altri presenti al tavolo con un **broadcast** (`io.emit`).

---

## 2. Gestione degli Abbandoni (`disconnect`)

Cosa succede se un giocatore chiude la scheda del browser a metà partita?

Sul server dobbiamo gestire due casi:
1. **La sedia si libera:**  
   Il giocatore viene rimosso dall'array `giocatori`.
2. **Era il suo turno di giocare?**  
   Se toccava proprio a lui, non possiamo lasciare il tavolo bloccato per sempre ad aspettarlo!  
   Il server deve automaticamente passare il turno al giocatore successivo (o al banco se era l'ultimo).

---

## 3. Quando Inizia la Mano? (Il Pulsante "Pronto" o Start)

In singolo giocatore, la mano partiva subito appena caricavi la pagina.  
Nel multiplayer ci sono due approcci standard:

* **Approccio Semplice (Consigliato per iniziare):**  
  C'è un pulsante "Distribuisci Carte" (o "Nuova Mano"). Quando viene premuto, se c'è almeno 1 giocatore seduto, il banco inizia la distribuzione per tutte le sedie occupate contemporaneamente.
* **Approccio a Countdown:**  
  Il banco fa partire un timer di 5 secondi quando i giocatori si siedono prima di distribuire.

---

## 4. Checklist Mentale per la Fase 2
* [ ] Impostare un limite massimo di giocatori per il tavolo (es. `MAX_GIOCATORI = 3`).
* [ ] Assegnare una postazione e un nome quando scatta l'evento di connessione.
* [ ] Rimuovere il giocatore dal tavolo e liberare la sedia quando scatta `disconnect`.
* [ ] Gestire l'avanzamento automatico del turno se chi si disconnette era il giocatore di turno.
* [ ] Informare tutti i giocatori connessi ogni volta che qualcuno entra o esce.

