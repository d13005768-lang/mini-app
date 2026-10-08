```javascript
"use strict";

/*
    STARCARD LEGENDS
    Frontend MVP
*/


/* ================================
   TELEGRAM
================================ */

const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();

    if (tg.setHeaderColor) {
        tg.setHeaderColor("#09090f");
    }

    if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#09090f");
    }
}


/* ================================
   PLAYER
================================ */

const defaultPlayer = {
    name: "Star Player",
    coins: 1000,
    stars: 0,
    cards: [],
    wins: 0,
    level: 1,
    dailyClaimed: false
};


let player;

try {
    const saved =
        localStorage.getItem("starcard_player");

    player = saved
        ? {
            ...defaultPlayer,
            ...JSON.parse(saved)
        }
        : { ...defaultPlayer };

} catch (error) {
    player = { ...defaultPlayer };
}


function save() {
    localStorage.setItem(
        "starcard_player",
        JSON.stringify(player)
    );
}


/* ================================
   HELPERS
================================ */

function number(value) {
    return Number(value).toLocaleString("ru-RU");
}


function haptic(type = "light") {

    if (!tg?.HapticFeedback) {
        return;
    }

    if (type === "success") {
        tg.HapticFeedback.notificationOccurred(
            "success"
        );
    } else if (type === "error") {
        tg.HapticFeedback.notificationOccurred(
            "error"
        );
    } else {
        tg.HapticFeedback.impactOccurred(
            "light"
        );
    }
}


/* ================================
   ELEMENTS
================================ */

const coins = document.getElementById("coins");
const stars = document.getElementById("stars");

const homeCards =
    document.getElementById("homeCards");

const homeWins =
    document.getElementById("homeWins");

const homeLevel =
    document.getElementById("homeLevel");

const collectionCount =
    document.getElementById("collectionCount");

const collectionContainer =
    document.getElementById(
        "collectionContainer"
    );

const profileCards =
    document.getElementById("profileCards");

const profileWins =
    document.getElementById("profileWins");

const profileCoins =
    document.getElementById("profileCoins");

const playerName =
    document.getElementById("playerName");

const profileAvatar =
    document.getElementById("profileAvatar");


/* ================================
   TELEGRAM USER
================================ */

if (tg?.initDataUnsafe?.user) {

    const user =
        tg.initDataUnsafe.user;

    const name =
        user.first_name ||
        user.username;

    if (
        name &&
        player.name === "Star Player"
    ) {
        player.name = name;
    }

    const letter =
        name
            ? name.charAt(0).toUpperCase()
            : "S";

    document
        .querySelectorAll(
            ".avatar-button"
        )
        .forEach(element => {
            element.textContent = letter;
        });

    if (profileAvatar) {
        profileAvatar.textContent = letter;
    }
}


/* ================================
   UPDATE UI
================================ */

function updateUI() {

    coins.textContent =
        number(player.coins);

    stars.textContent =
        number(player.stars);

    homeCards.textContent =
        player.cards.length;

    homeWins.textContent =
        player.wins;

    homeLevel.textContent =
        player.level;

    collectionCount.textContent =
        player.cards.length;

    profileCards.textContent =
        player.cards.length;

    profileWins.textContent =
        player.wins;

    profileCoins.textContent =
        number(player.coins);

    playerName.textContent =
        player.name;

    renderCards();

    save();
}


/* ================================
   NAVIGATION
================================ */

const pages = {
    home: document.getElementById("homePage"),
    collection: document.getElementById("collectionPage"),
    battles: document.getElementById("battlesPage"),
    market: document.getElementById("marketPage"),
    profile: document.getElementById("profilePage")
};


function showPage(name) {

    Object.values(pages).forEach(page => {

        if (page) {
            page.classList.add("hidden");
        }

    });

    if (pages[name]) {
        pages[name].classList.remove("hidden");
    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

            if (
                button.dataset.page === name
            ) {
                button.classList.add(
                    "active"
                );
            }
        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    haptic();
}


/* ================================
   NAV BUTTONS
================================ */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                showPage(page);
            }
        );
    });


document
    .getElementById("profileButton")
    ?.addEventListener(
        "click",
        () => showPage("profile")
    );


/* ================================
   CARD DATABASE
================================ */

const cardDatabase = [

    {
        name: "VOID RUNNER",
        rarity: "COMMON",
        power: 10,
        symbol: "◇"
    },

    {
        name: "CYBER WOLF",
        rarity: "COMMON",
        power: 10,
        symbol: "◈"
    },

    {
        name: "NEON GHOST",
        rarity: "RARE",
        power: 30,
        symbol: "✦"
    },

    {
        name: "STAR HUNTER",
        rarity: "RARE",
        power: 30,
        symbol: "✧"
    },

    {
        name: "VOID EMPEROR",
        rarity: "EPIC",
        power: 60,
        symbol: "◆"
    },

    {
        name: "GALAXY KING",
        rarity: "LEGENDARY",
        power: 100,
        symbol: "★"
    }
];


/* ================================
   RANDOM CARD
================================ */

function randomCard() {

    const roll =
        Math.random() * 100;

    let rarity;

    if (roll < 70) {
        rarity = "COMMON";
    }
    else if (roll < 90) {
        rarity = "RARE";
    }
    else if (roll < 98) {
        rarity = "EPIC";
    }
    else {
        rarity = "LEGENDARY";
    }


    const possible =
        cardDatabase.filter(
            card =>
                card.rarity === rarity
        );


    const template =
        possible[
            Math.floor(
                Math.random() *
                possible.length
            )
        ];


    return {
        id:
            Date.now() +
            Math.random(),

        ...template
    };
}


/* ================================
   OPEN PACK
================================ */

document
    .getElementById("openPack")
    ?.addEventListener(
        "click",
        openPack
    );


function openPack() {

    const price = 50;


    if (player.coins < price) {

        haptic("error");

        showModal(
            "NOT ENOUGH COINS",
            `
                <p style="
                    color:#777783;
                    font-size:9px;
                    line-height:1.5;
                    margin:12px 0 20px;
                ">
                    You need ${price} Coins
                    to open this pack.
                </p>
            `,
            "OK"
        );

        return;
    }


    player.coins -= price;


    const cards = [];

    for (let i = 0; i < 5; i++) {
        cards.push(randomCard());
    }


    player.cards.push(...cards);


    updateUI();

    haptic("success");

    showPackResult(cards);
}


/* ================================
   RENDER COLLECTION
================================ */

function renderCards() {

    if (!player.cards.length) {

        collectionContainer.innerHTML = `
            <div class="empty-market"
                 style="grid-column:1/-1">

                <div class="empty-icon">
                    ◇
                </div>

                <h3>
                    Collection is empty
                </h3>

                <p>
                    Open a pack to get your
                    first cards.
                </p>

            </div>
        `;

        return;
    }


    collectionContainer.innerHTML =
        player.cards
            .slice()
            .reverse()
            .map(card => {

                return `
                    <article class="card">

                        <div class="card-symbol">
                            ${card.symbol}
                        </div>

                        <div class="card-name">
                            ${card.name}
                        </div>

                        <div class="card-rarity">
                            ${card.rarity}
                            ·
                            ${card.power} POWER
                        </div>

                    </article>
                `;
            })
            .join("");
}


/* ================================
   PACK RESULT
================================ */

function showPackResult(cards) {

    const overlay =
        document.createElement("div");

    overlay.className = "modal";


    overlay.innerHTML = `

        <div class="modal-box">

            <span class="label">
                PACK OPENED
            </span>

            <h2>
                YOUR CARDS
            </h2>

            <div class="result-grid">

                ${cards.map(card => `

                    <div class="result-card">

                        <div
                            class="result-symbol"
                        >
                            ${card.symbol}
                        </div>

                        <strong>
                            ${card.name}
                        </strong>

                        <span>
                            ${card.rarity}
                            ·
                            ${card.power}
                        </span>

                    </div>

                `).join("")}

            </div>

            <button
                class="main-button"
                id="closeModal"
            >
                CONTINUE
            </button>

        </div>
    `;


    document.body.appendChild(overlay);


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            () => {

                overlay.remove();

                showPage(
                    "collection"
                );
            }
        );
}


/* ================================
   GENERIC MODAL
================================ */

function showModal(
    title,
    content,
    buttonText
) {

    const overlay =
        document.createElement("div");

    overlay.className = "modal";


    overlay.innerHTML = `

        <div class="modal-box">

            <span class="label">
                STARCARD
            </span>

            <h2>
                ${title}
            </h2>

            ${content}

            <button
                class="main-button"
                id="closeModal"
            >
                ${buttonText}
            </button>

        </div>
    `;


    document.body.appendChild(overlay);


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            () => overlay.remove()
        );
}


/* ================================
   DAILY MISSION
================================ */

document
    .getElementById("dailyMission")
    ?.addEventListener(
        "click",
        claimDaily
    );


function claimDaily() {

    if (player.dailyClaimed) {

        showModal(
            "ALREADY CLAIMED",
            `
                <p style="
                    color:#777783;
                    font-size:9px;
                    margin:12px 0 20px;
                ">
                    Come back tomorrow.
                </p>
            `,
            "OK"
        );

        return;
    }


    player.coins += 100;

    player.dailyClaimed = true;

    updateUI();

    haptic("success");


    showModal(
        "REWARD RECEIVED",
        `
            <p style="
                color:#777783;
                font-size:9px;
                margin:12px 0 20px;
            ">
                You received
                <b style="color:#ffd45a">
                    +100 Coins
                </b>.
            </p>
        `,
        "CONTINUE"
    );
}


/* ================================
   BATTLE
================================ */

document
    .getElementById("battleButton")
    ?.addEventListener(
        "click",
        () => {

            if (!player.cards.length) {

                showModal(
                    "NO CARDS",
                    `
                        <p style="
                            color:#777783;
                            font-size:9px;
                            margin:12px 0 20px;
                        ">
                            Open a pack first
                            and get a card.
                        </p>
                    `,
                    "OK"
                );

                return;
            }


            const win =
                Math.random() > .45;


            if (win) {

                player.wins++;

                player.coins += 75;

                updateUI();

                haptic("success");


                showModal(
                    "VICTORY",
                    `
                        <p style="
                            color:#777783;
                            font-size:9px;
                            margin:12px 0 20px;
                        ">
                            You won the battle
                            and received
                            <b style="color:#ffd45a">
                                +75 Coins
                            </b>.
                        </p>
                    `,
                    "NICE"
                );

            } else {

                haptic("error");


                showModal(
                    "DEFEAT",
                    `
                        <p style="
                            color:#777783;
                            font-size:9px;
                            margin:12px 0 20px;
                        ">
                            Better luck next battle.
                        </p>
                    `,
                    "OK"
                );
            }
        }
    );


/* ================================
   MARKET TABS
================================ */

document
    .querySelectorAll(".market-tabs button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".market-tabs button"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );

                haptic();
            }
        );
    });


/* ================================
   START
================================ */

updateUI();

showPage("home");
```
