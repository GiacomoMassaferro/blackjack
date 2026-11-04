import { useState } from "react";

export default function VisualizzaMano(mano, nascondiPrimaCarta) {
    return mano.map((carta, index) => {
        if (nascondiPrimaCarta === true && index === 0) {
            return (
                <div key="dealer-covered" className="playing-card card-covered">
                    <span className="card-back-icon">🂠</span>
                </div>
            );
        } else {
            const isRed = carta.card.includes("♥") || carta.card.includes("♦");
            return (
                <div key={`${carta.card}-${index}`} className={`playing-card ${isRed ? "card-red" : "card-black"}`}>
                    <span className="card-text">{carta.card}</span>
                </div>
            );
        }
    });
}
