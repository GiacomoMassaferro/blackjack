const seeds = ["♠", "♥", "♦", "♣"];
const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export default function nuovoMazzo() {

    const mazzo = [];
    for (let i = 0; i < seeds.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            let score = 0;
            if (numbers[j] === "A") {
                score = 11;
            } else if (numbers[j] === "J" || numbers[j] === "Q" || numbers[j] === "K") {
                score = 10;
            } else {
                score = Number(numbers[j]);
            }
            mazzo.push({ card: `${numbers[j]}${seeds[i]}`, value: score });
        };
    };

    // --- ALGORITMO DI FISHER-YATES PER MESCOLARE ---
    for (let i = mazzo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Scambia l'elemento i-esimo con un elemento casuale j-esimo
        [mazzo[i], mazzo[j]] = [mazzo[j], mazzo[i]];
    }

    return mazzo;
};