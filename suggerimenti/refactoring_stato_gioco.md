
## 3. Gestione del Blackjack Naturale (21 all'avvio)

### Cos'è e Quando si Controlla:
* Il Blackjack Naturale si verifica solo con le **prime due carte** distribuite (Asso + figura/10).
* Va controllato **subito all'inizio della mano**, prima ancora che il giocatore possa cliccare "Chiama" o "Stai".

### I 4 Scenari da Valutare in Ordine:
1. **Entrambi hanno 21:** La mano si chiude all'istante con un Pareggio (`PAREGGIO`).
2. **Solo il Giocatore ha 21:** Il giocatore vince subito con Blackjack (`BLACKJACK`).
3. **Solo il Dealer ha 21:** Il banco mostra subito il suo 21 e il giocatore perde all'istante (`SCONFITTA`).
4. **Nessuno dei due ha 21:** La partita procede regolarmente rimanendo nello stato `IN_CORSO`.

### Consiglio sull'Asincronia di React:
* Ricorda che i setter di React non aggiornano le variabili nello stesso millisecondo in cui li chiami.
* Fai il controllo del 21 calcolando il punteggio **direttamente sugli array temporanei** appena estratti dal mazzo, prima di passarli a React, e imposta lo stato della partita di conseguenza.

---

## 4. Tasto "Nuova Partita"

### Quando Mostrarlo:
* Il pulsante per rigiocare deve comparire a schermo solo ed esclusivamente quando la partita è finita (ovvero quando lo stato del gioco è diverso da `IN_CORSO`).

### Cosa Deve Fare la Funzione di Reset:
1. Creare e mescolare un nuovo mazzo di carte.
2. Estrarre due carte per il dealer e due per il player.
3. Eseguire il controllo del Blackjack Naturale sulle nuove mani.
4. Aggiornare tutti gli stati di React (mazzo, mani e stato partita).
