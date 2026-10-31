export const STATO_GIOCO = {
    IN_CORSO: 'IN_CORSO',
    PLAYER_SBALLATO: 'PLAYER_SBALLATO',
    DEALER_SBALLATO: 'DEALER_SBALLATO',
    VITTORIA: 'VITTORIA',
    SCONFITTA: 'SCONFITTA',
    PAREGGIO: 'PAREGGIO',
    BLACKJACK: 'BLACKJACK'
};

export const messaggiEsito = {
    [STATO_GIOCO.PLAYER_SBALLATO]: "Hai sballato! Vince il banco.",
    [STATO_GIOCO.DEALER_SBALLATO]: "Il banco ha sballato! Hai vinto!",
    [STATO_GIOCO.VITTORIA]: "Complimenti, hai vinto!",
    [STATO_GIOCO.SCONFITTA]: "Ha vinto il banco!",
    [STATO_GIOCO.PAREGGIO]: "Pareggio (Push)!",
    [STATO_GIOCO.BLACKJACK]: "Black Jack!! HAI VINTO!!!"
};