import { useState } from "react";


export default function VisualizzaMano(mano, nascondiCarta) {
    return mano.map((carta, index) => {
        if (nascondiCarta === true && index === 0) {
            return <div key={index}>{"🂠"}</div>
        } else {
            return <div key={index}>{carta.card}</div>
        }
    })
}