import { useState } from "react";


export default function VisualizzaMano(mano) {
    return mano.map((carta, index) => {
        return <div key={index}>{carta.card}</div>
    })
}