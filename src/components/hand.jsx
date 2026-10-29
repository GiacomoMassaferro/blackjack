import { useState } from "react";


export default function visualizzaMano(mano) {
    return mano.map((carta, index) => {
        return <div key={index}>{carta.card}</div>
    })
}