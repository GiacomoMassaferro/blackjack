import { useState } from 'react';
import { useEffect } from 'react';
import { STATO_GIOCO, messaggiEsito } from './utility/statiGioco';
import nuovoMazzo from './utility/nuovoMazzo';
import VisualizzaMano from './components/hand';
import calcolaPunteggio from './utility/calcolaPunteggio';
import './App.css';

function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [statoGioco, setStatoGioco] = useState(STATO_GIOCO.IN_CORSO);

  useEffect(() => {
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
  }

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
    const punteggioGiocatore = calcolaPunteggio(playerHand);
    if (punteggioAttuale > 21) {
      setStatoGioco(STATO_GIOCO.DEALER_SBALLATO);
    } else if (punteggioAttuale > punteggioGiocatore) {
      setStatoGioco(STATO_GIOCO.SCONFITTA);
    } else if (punteggioAttuale < punteggioGiocatore) {
      setStatoGioco(STATO_GIOCO.VITTORIA);
    } else if (punteggioAttuale === punteggioGiocatore) {
      setStatoGioco(STATO_GIOCO.PAREGGIO);
    }
  }

  function nuovaPartita() {
    const mazzo = nuovoMazzo();
    const manoTavolo = [mazzo.pop(), mazzo.pop()];
    const manoGiocatore = [mazzo.pop(), mazzo.pop()];
    setDealerHand(manoTavolo);
    setPlayerHand(manoGiocatore);
    setDeck(mazzo);
    const punteggioTavolo = calcolaPunteggio(manoTavolo);
    const punteggioPlayer = calcolaPunteggio(manoGiocatore);
    if (punteggioPlayer === 21 && punteggioTavolo === 21) {
      setStatoGioco(STATO_GIOCO.PAREGGIO);
    } else if (punteggioPlayer === 21) {
      setStatoGioco(STATO_GIOCO.BLACKJACK);
    } else if (punteggioTavolo === 21) {
      setStatoGioco(STATO_GIOCO.SCONFITTA);
    } else {
      setStatoGioco(STATO_GIOCO.IN_CORSO);
    }
  }

  return (
    <div className="casino-app">
      <header className="casino-header">
        <h1>♠ Blackjack Royale ♥</h1>
        <div className="deck-counter">
          Carte nel mazzo: <span>{deck.length}</span>
        </div>
      </header>

      <main className="blackjack-table">
        {/* Sezione Banco */}
        <section className="hand-area dealer-area">
          <div className="area-info">
            <h2>BANCO</h2>
            <div className="score-pill">
              Punteggio: <strong>{statoGioco === STATO_GIOCO.IN_CORSO ? "?" : calcolaPunteggio(dealerHand)}</strong>
            </div>
          </div>
          <div className="cards-row">
            {VisualizzaMano(dealerHand, statoGioco === STATO_GIOCO.IN_CORSO)}
          </div>
        </section>

        {/* Banner Esito Partita */}
        {messaggiEsito[statoGioco] && (
          <div className="outcome-banner">
            <h2>{messaggiEsito[statoGioco]}</h2>
          </div>
        )}

        {/* Sezione Giocatore */}
        <section className="hand-area player-area">
          <div className="area-info">
            <h2>GIOCATORE</h2>
            <div className="score-pill">
              Punteggio: <strong>{calcolaPunteggio(playerHand)}</strong>
            </div>
          </div>
          <div className="cards-row">
            {VisualizzaMano(playerHand, false)}
          </div>
        </section>

        {/* Pulsantiera di Gioco */}
        <footer className="table-controls">
          <button 
            className="action-btn hit-btn" 
            onClick={chiamaCarta} 
            disabled={statoGioco !== STATO_GIOCO.IN_CORSO}
          >
            Chiama Carta
          </button>
          
          <button 
            className="action-btn stand-btn" 
            onClick={stay} 
            disabled={statoGioco !== STATO_GIOCO.IN_CORSO}
          >
            Stai
          </button>

          {statoGioco !== STATO_GIOCO.IN_CORSO && (
            <button className="action-btn replay-btn" onClick={nuovaPartita}>
              Nuova Partita
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
