import { useState } from "react";

export default function calcolaPunteggio(mano) {
    let assi = 0;
    let valoreMano = 0;
    for (let i = 0; i < mano.length; i++) {
        if (mano[i] && typeof mano[i].value === 'number') {

            if (mano[i].value === 11) {
                assi++;
            };
            valoreMano = valoreMano + Number(mano[i].value);
        }
    }
    while (valoreMano > 21 && assi > 0) {
        valoreMano = valoreMano - 10;
        assi--;
    }
    return valoreMano;
}