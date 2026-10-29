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

  return (
    <div>
      <h1>Blackjack in React</h1>
      <p>Carte nel mazzo: {deck.length}</p>
      <h2>mano dealer:{calcolaPunteggio(dealerHand)}</h2>
      {visualizzaMano(dealerHand)}
      <h2>mano player:{calcolaPunteggio(playerHand)}{playerOverDraw && " Hai sballato, hai perso la puntata!!"}</h2>
      {visualizzaMano(playerHand)}
      <button onClick={chiamaCarta}>Chiama</button><button>Stai</button>
    </div>
  );
}

export default App
