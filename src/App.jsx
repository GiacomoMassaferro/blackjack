import { useState } from 'react';
import { useEffect } from 'react';
import nuovoMazzo from './utility/nuovoMazzo';
import visualizzaMano from './components/hand';
import calcolaPunteggio from './utility/calcolaPunteggio';
import './App.css'


function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerOverDraw, setPlayerOverDraw] = useState(false);
  const [startDealerTurn, setStartDealerTurn] = useState(false);
  const [dealerOverdraw, setDealerOverdraw] = useState(false);
  const [vittoria, setVittoria] = useState(false);
  const [sconfitta, setSconfitta] = useState(false);
  const [push, setPush] = useState(false);
  const [bj, setBj] = useState(false);

  useEffect(() => {

    const mazzo = nuovoMazzo();
    setDealerHand([mazzo.pop(), mazzo.pop()]);
    setPlayerHand([mazzo.pop(), mazzo.pop()]);

    setDeck(mazzo);
  }, []);
  console.log(deck);
  console.log(dealerHand);
  console.log(playerHand);

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
          setPlayerOverDraw(true);
        }
      }
    }
  }

  function stay() {
    setStartDealerTurn(true);
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
      setDealerOverdraw(true);
      setVittoria(true);
    } else if (punteggioAttuale > calcolaPunteggio(playerHand)) {
      setSconfitta(true);
    } else if (punteggioAttuale < calcolaPunteggio(playerHand)) {
      setVittoria(true);
    } else if (punteggioAttuale === calcolaPunteggio(playerHand)) {
      setPush(true);
    }
  }

  return (
    <div>
      <h1>Blackjack in React</h1>
      <p>Carte nel mazzo: {deck.length}</p>
      <h2>mano dealer:{calcolaPunteggio(dealerHand)}</h2>
      {visualizzaMano(dealerHand)}
      <h2>mano player:{calcolaPunteggio(playerHand)}{playerOverDraw && " Hai sballato, hai perso la puntata!!"}</h2>
      {visualizzaMano(playerHand)}
      <button onClick={chiamaCarta} disabled={playerOverDraw || startDealerTurn}>Chiama</button><button onClick={stay} disabled={playerOverDraw || startDealerTurn}>Stai</button>
    </div>
  );
}

export default App
