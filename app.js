const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

// Сообщаем Telegram, что приложение готово
tg.ready();

// Разворачиваем Mini App
tg.expand();


// -----------------------------
// ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
// -----------------------------

const user = tg.initDataUnsafe?.user;

if (user) {
    console.log("Игрок:", user.first_name);
    console.log("Telegram ID:", user.id);
}


// -----------------------------
// МОНЕТЫ
// -----------------------------

let coins = Number(localStorage.getItem("coins")) || 100;

const coinsElement = document.getElementById("coins");

if (coinsElement) {
    coinsElement.textContent = coins;
}


// -----------------------------
// КАРТЫ
// -----------------------------

let cards = Number(localStorage.getItem("cards")) || 0;

const cardsElement = document.getElementById("cards");

if (cardsElement) {
    cardsElement.textContent = cards;
}


// -----------------------------
// ОТКРЫТИЕ ПАКА
// -----------------------------

const openPackButton = document.getElementById("openPack");

if (openPackButton) {
    openPackButton.addEventListener("click", () => {

        if (coins < 10) {
            tg.showAlert("❌ Недостаточно монет!");
            return;
        }

        coins -= 10;
        cards += 1;

        localStorage.setItem("coins", coins);
        localStorage.setItem("cards", cards);

        coinsElement.textContent = coins;
        cardsElement.textContent = cards;

        tg.HapticFeedback.impactOccurred("medium");

        tg.showAlert(
            "🎉 Ты получил новую карту!\n\n"
            + "🎴 Карта добавлена в коллекцию."
        );
    });
}


// -----------------------------
// КНОПКИ МЕНЮ
// -----------------------------

const menuCards = document.querySelectorAll(".menu-card");

menuCards.forEach((button) => {

    button.addEventListener("click", () => {

        const title = button.querySelector("b")?.textContent;

        if (title === "Коллекция") {
            tg.showAlert("📚 Коллекция пока находится в разработке.");
        }

        if (title === "Рейтинг") {
            tg.showAlert("🏆 Рейтинг скоро появится.");
        }

        if (title === "Награды") {
            tg.showAlert("🎁 Новые награды скоро будут доступны.");
        }

        if (title === "Профиль") {
            if (user) {
                tg.showAlert(
                    "👤 Профиль\n\n"
                    + "Игрок: " + user.first_name + "\n"
                    + "ID: " + user.id
                );
            } else {
                tg.showAlert("👤 Профиль доступен внутри Telegram.");
            }
        }

        tg.HapticFeedback.selectionChanged();
    });
});


// -----------------------------
// НИЖНЕЕ МЕНЮ
// -----------------------------

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {

    item.addEventListener("click", () => {

        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        const name = item.querySelector("small")?.textContent;

        if (name === "Главная") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        if (name === "Коллекция") {
            tg.showAlert("📚 Коллекция скоро будет доступна.");
        }

        if (name === "Паки") {
            document
                .getElementById("openPack")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
        }

        if (name === "Профиль") {
            tg.showAlert("👤 Профиль игрока");
        }

        tg.HapticFeedback.selectionChanged();
    });
});
```
