```javascript
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

// =====================
// ДАННЫЕ
// =====================

let coins = Number(localStorage.getItem("coins"));

if (!coins) {
    coins = 100;
}

let collection;

try {
    collection = JSON.parse(
        localStorage.getItem("collection")
    ) || [];
} catch {
    collection = [];
}


// =====================
// ЭЛЕМЕНТЫ
// =====================

const coinsElement = document.getElementById("coins");
const coinsStat = document.getElementById("coinsStat");
const cardsElement = document.getElementById("cards");

const profileCoins =
    document.getElementById("profileCoins");

const profileCards =
    document.getElementById("profileCards");

const playerName =
    document.getElementById("playerName");

const homePage =
    document.getElementById("homePage");

const packPage =
    document.getElementById("packPage");

const collectionPage =
    document.getElementById("collectionPage");

const profilePage =
    document.getElementById("profilePage");

const rewardsPage =
    document.getElementById("rewardsPage");

const cardsContainer =
    document.getElementById("cardsContainer");

const collectionContainer =
    document.getElementById("collectionContainer");


// =====================
// ИМЯ TELEGRAM
// =====================

const user = tg?.initDataUnsafe?.user;

if (user && playerName) {
    playerName.textContent =
        user.first_name || "Игрок";
}


// =====================
// ОБНОВЛЕНИЕ
// =====================

function updateUI() {

    if (coinsElement) {
        coinsElement.textContent = coins;
    }

    if (coinsStat) {
        coinsStat.textContent = coins;
    }

    if (cardsElement) {
        cardsElement.textContent =
            collection.length;
    }

    if (profileCoins) {
        profileCoins.textContent = coins;
    }

    if (profileCards) {
        profileCards.textContent =
            collection.length;
    }

    localStorage.setItem(
        "coins",
        String(coins)
    );

    localStorage.setItem(
        "collection",
        JSON.stringify(collection)
    );
}

updateUI();


// =====================
// КАРТЫ
// =====================

const cardList = [
    {
        name: "Звёздный Воин",
        icon: "⚔️",
        rarity: "COMMON"
    },
    {
        name: "Космический Маг",
        icon: "🧙",
        rarity: "COMMON"
    },
    {
        name: "Галактический Охотник",
        icon: "🏹",
        rarity: "RARE"
    },
    {
        name: "Повелитель Тьмы",
        icon: "🌑",
        rarity: "EPIC"
    },
    {
        name: "Легендарный Дракон",
        icon: "🐉",
        rarity: "LEGENDARY"
    }
];


// =====================
// СЛУЧАЙНАЯ КАРТА
// =====================

function getRandomCard() {

    const number =
        Math.floor(
            Math.random() * 100
        );

    if (number < 3) {
        return cardList[4];
    }

    if (number < 15) {
        return cardList[3];
    }

    if (number < 40) {
        return cardList[2];
    }

    const commonCards = [
        cardList[0],
        cardList[1]
    ];

    return commonCards[
        Math.floor(
            Math.random() *
            commonCards.length
        )
    ];
}


// =====================
// ОТКРЫТЬ ПАК
// =====================

function openPack() {

    if (coins < 10) {

        showMessage(
            "❌ Недостаточно монет!\n\nНужно 10 💰"
        );

        return;
    }

    coins -= 10;

    const newCards = [];

    for (let i = 0; i < 5; i++) {

        const card =
            getRandomCard();

        newCards.push(card);

        collection.push(card);
    }

    updateUI();

    showPack(newCards);

    haptic();
}


// =====================
// ПОКАЗАТЬ ПАК
// =====================

function showPack(newCards) {

    hideAllPages();

    packPage.classList.remove(
        "hidden"
    );

    cardsContainer.innerHTML = "";

    newCards.forEach(card => {

        const element =
            document.createElement("div");

        element.className =
            "card-item";

        element.innerHTML =
            '<div class="card-icon">' +
            card.icon +
            '</div>' +

            '<div class="card-name">' +
            card.name +
            '</div>' +

            '<div class="card-rarity">' +
            card.rarity +
            '</div>';

        cardsContainer.appendChild(
            element
        );
    });
}


// =====================
// КОЛЛЕКЦИЯ
// =====================

function showCollection() {

    hideAllPages();

    collectionPage.classList.remove(
        "hidden"
    );

    collectionContainer.innerHTML = "";

    if (collection.length === 0) {

        collectionContainer.innerHTML =
            '<div class="collection-empty">' +
            '📚<br><br>' +
            'Коллекция пока пустая.<br>' +
            'Открой свой первый пак!' +
            '</div>';

        return;
    }

    collection.forEach(card => {

        const element =
            document.createElement("div");

        element.className =
            "card-item";

        element.innerHTML =
            '<div class="card-icon">' +
            card.icon +
            '</div>' +

            '<div class="card-name">' +
            card.name +
            '</div>' +

            '<div class="card-rarity">' +
            card.rarity +
            '</div>';

        collectionContainer.appendChild(
            element
        );
    });
}


// =====================
// СТРАНИЦЫ
// =====================

function hideAllPages() {

    homePage.classList.add("hidden");
    packPage.classList.add("hidden");
    collectionPage.classList.add("hidden");
    profilePage.classList.add("hidden");
    rewardsPage.classList.add("hidden");
}

function showHome() {

    hideAllPages();

    homePage.classList.remove(
        "hidden"
    );
}

function showProfile() {

    hideAllPages();

    profilePage.classList.remove(
        "hidden"
    );

    updateUI();
}

function showRewards() {

    hideAllPages();

    rewardsPage.classList.remove(
        "hidden"
    );
}


// =====================
// TELEGRAM ВИБРАЦИЯ
// =====================

function haptic() {

    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(
            "medium"
        );
    }
}


// =====================
// СООБЩЕНИЕ
// =====================

function showMessage(message) {

    if (tg) {
        tg.showAlert(message);
    } else {
        alert(message);
    }
}


// =====================
// КНОПКА ОТКРЫТИЯ ПАКА
// =====================

const openPackButton =
    document.getElementById("openPack");

if (openPackButton) {

    openPackButton.addEventListener(
        "click",
        openPack
    );
}


// =====================
// ЕЩЁ ОДИН ПАК
// =====================

const anotherPack =
    document.getElementById(
        "openAnotherPack"
    );

if (anotherPack) {

    anotherPack.addEventListener(
        "click",
        openPack
    );
}


// =====================
// НАЗАД
// =====================

const backHome =
    document.getElementById(
        "backHome"
    );

if (backHome) {

    backHome.addEventListener(
        "click",
        showHome
    );
}


// =====================
// КНОПКИ НАЗАД
// =====================

document
    .querySelectorAll("[data-home]")
    .forEach(button => {

        button.addEventListener(
            "click",
            showHome
        );
    });


// =====================
// БЫСТРЫЕ КНОПКИ
// =====================

document
    .querySelectorAll(".menu-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const page =
                    button.dataset.page;

                if (page === "collection") {
                    showCollection();
                }

                if (page === "packs") {
                    showHome();

                    openPackButton?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                if (page === "profile") {
                    showProfile();
                }

                if (page === "rewards") {
                    showRewards();
                }
            }
        );
    });


// =====================
// НИЖНЕЕ МЕНЮ
// =====================

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const page =
                    button.dataset.page;

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "active"
                        );
                    });

                button.classList.add(
                    "active"
                );

                if (page === "home") {
                    showHome();
                }

                if (page === "collection") {
                    showCollection();
                }

                if (page === "packs") {
                    showHome();

                    openPackButton?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                if (page === "profile") {
                    showProfile();
                }
            }
        );
    });
```
