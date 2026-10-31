import { useState } from 'react';
import { useEffect } from 'react';
import { STATO_GIOCO } from './utility/statiGioco';
import { messaggiEsito } from './utility/statiGioco';
import nuovoMazzo from './utility/nuovoMazzo';
import VisualizzaMano from './components/hand';
import calcolaPunteggio from './utility/calcolaPunteggio';
import './App.css'


function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [statoGioco, setStatoGioco] = useState(STATO_GIOCO.IN_CORSO);

  useEffect(() => {
    // setStatoGioco(STATO_GIOCO.IN_CORSO);
    // const mazzo = nuovoMazzo();
    // setDealerHand([mazzo.pop(), mazzo.pop()]);
    // setPlayerHand([mazzo.pop(), mazzo.pop()]);
    // setDeck(mazzo);
    nuovaPartita();
  }, []);

  function chiamaCarta() {
    const mazzo = [...deck];
    if (mazzo.length > 0) {
      const punteggioAttuale = calcolaPunteggio(playerHand);
      if (punteggioAttuale < 21) {
        const cartaPescata = mazzo.pop();
        setDeck(mazzo);

        const nuovaMano = [...playerHand, cartaPescata];
        setPlayerHand(nuovaMano);

        if (calcolaPunteggio(nuovaMano) > 21) {
          setStatoGioco(STATO_GIOCO.PLAYER_SBALLATO);
        }
      }
    }
  };

  function stay() {
    let mazzo = [...deck];
    let manoDealer = [...dealerHand];
    let punteggioAttuale = calcolaPunteggio(dealerHand);
    while (punteggioAttuale < 17 && mazzo.length > 0) {
      const cartaPescata = mazzo.pop();
      manoDealer = [...manoDealer, cartaPescata];
      punteggioAttuale = calcolaPunteggio(manoDealer);
    }
    setDealerHand(manoDealer);
    setDeck(mazzo);
    if (punteggioAttuale > 21) {
      setStatoGioco(STATO_GIOCO.DEALER_SBALLATO);
    } else if (punteggioAttuale > calcolaPunteggio(playerHand)) {
      setStatoGioco(STATO_GIOCO.SCONFITTA);
    } else if (punteggioAttuale < calcolaPunteggio(playerHand)) {
      setStatoGioco(STATO_GIOCO.VITTORIA);
    } else if (punteggioAttuale === calcolaPunteggio(playerHand)) {
      setStatoGioco(STATO_GIOCO.PAREGGIO);
    }
  }

  function nuovaPartita() {
    setStatoGioco(STATO_GIOCO.IN_CORSO);
    const mazzo = nuovoMazzo();
    setDealerHand([mazzo.pop(), mazzo.pop()]);
    setPlayerHand([mazzo.pop(), mazzo.pop()]);
    setDeck(mazzo);
  };

  return (
    <div>
      <h1>Blackjack in React</h1>
      <p>Carte nel mazzo: {deck.length}</p>
      <h2>mano dealer:{calcolaPunteggio(dealerHand)}</h2>
      {VisualizzaMano(dealerHand)}
      <h2>mano player:{calcolaPunteggio(playerHand)}</h2>
      {VisualizzaMano(playerHand)}
      <button onClick={chiamaCarta} disabled={statoGioco !== STATO_GIOCO.IN_CORSO}>Chiama</button>
      <button onClick={stay} disabled={statoGioco !== STATO_GIOCO.IN_CORSO}>Stai</button>
      {statoGioco !== STATO_GIOCO.IN_CORSO && (
        <button onClick={nuovaPartita}>Gioca ancora</button>
      )}
      {messaggiEsito[statoGioco] && (
        <h2>{messaggiEsito[statoGioco]}</h2>
      )}
    </div>
  );
}

export default App
