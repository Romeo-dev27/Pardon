const particlesLayer = document.querySelector(".particles");
const petalStage = document.querySelector(".petal-stage");
const envelope = document.querySelector(".envelope");
const apologyMessage = document.querySelector("#apology-message");
const finalSection = document.querySelector(".final-section");
const finalButton = document.querySelector(".final-button");
const thanksMessage = document.querySelector(".thanks-message");
const flowers = document.querySelectorAll(".flower");

const sweetMessages = [
    "Tu comptes beaucoup pour moi.",
    "Je suis sincèrement désolé.",
    "Merci pour ta patience.",
    "J'aimerais réparer les choses avec douceur.",
    "Ton sourire mérite mieux que mes erreurs."
];

const originalLetter = apologyMessage.textContent.trim();
let letterHasOpened = false;
let typingTimer = null;

createAmbientParticles();

envelope.addEventListener("click", openLetter);
envelope.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLetter();
    }
});
finalButton.addEventListener("click", celebrateReading);

flowers.forEach((flower) => {
    flower.addEventListener("click", (event) => {
        event.stopPropagation();
        playRandomFlowerEffect(flower);
    });
});

function createAmbientParticles() {
    // Ces points lumineux donnent de la profondeur sans alourdir la page.
    for (let index = 0; index < 34; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.setProperty("--left", `${randomNumber(0, 100)}vw`);
        particle.style.setProperty("--size", `${randomNumber(3, 9)}px`);
        particle.style.setProperty("--duration", `${randomNumber(9, 18)}s`);
        particle.style.setProperty("--delay", `${randomNumber(-18, 0)}s`);
        particle.style.setProperty("--drift", `${randomNumber(-80, 80)}px`);
        particlesLayer.appendChild(particle);
    }
}

function openLetter() {
    if (letterHasOpened) {
        return;
    }

    letterHasOpened = true;
    envelope.classList.add("open");

    window.setTimeout(() => {
        typeLetter(originalLetter);
    }, 1120);
}

function typeLetter(text) {
    // Le texte reste éditable dans le HTML, puis il est rejoué ici en machine à écrire.
    let index = 0;
    apologyMessage.textContent = "";
    envelope.classList.add("typing");

    clearInterval(typingTimer);
    typingTimer = window.setInterval(() => {
        apologyMessage.textContent += text.charAt(index);
        index += 1;

        if (index >= text.length) {
            clearInterval(typingTimer);
            envelope.classList.remove("typing");
            finalSection.classList.add("visible");
        }
    }, 42);
}

function playRandomFlowerEffect(flower) {
    // Chaque clic choisit un effet différent pour garder une sensation vivante.
    const effects = [
        petalExplosion,
        floatingHeart,
        openFlower,
        showSoftMessage,
        petalRain,
        romanticSparkles
    ];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    effect(flower);
}
function petalExplosion(flower) {
    const { x, y } = getFlowerCenter(flower);

    for (let index = 0; index < 24; index += 1) {
        createPetal({
            x,
            y,
            fallX: randomNumber(-170, 170),
            fallY: randomNumber(90, 280),
            rotate: `${randomNumber(-280, 280)}deg`,
            duration: randomNumber(1.6, 3),
            color: randomPetalColor()
        });
    }
}

function floatingHeart(flower) {
    const { x, y } = getFlowerCenter(flower);
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.style.left = `${x}px`;
    heart.style.top = `${y - 22}px`;
    document.body.appendChild(heart);
    removeAfterAnimation(heart, 2000);
}

function openFlower(flower) {
    flower.classList.add("bloom-open");
    window.setTimeout(() => flower.classList.remove("bloom-open"), 1900);
}

function showSoftMessage(flower) {
    const { x, y } = getFlowerCenter(flower);
    const message = document.createElement("span");
    message.className = "soft-message";
    message.textContent = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
    message.style.left = `${x}px`;
    message.style.top = `${Math.max(24, y - 86)}px`;
    document.body.appendChild(message);
    removeAfterAnimation(message, 3100);
}

function petalRain() {
    // Pluie transversale utilisée par les fleurs et par le bouton final.
    for (let index = 0; index < 52; index += 1) {
        window.setTimeout(() => {
            createPetal({
                x: randomNumber(-40, window.innerWidth + 40),
                y: randomNumber(-90, -10),
                fallX: randomNumber(-90, 90),
                fallY: window.innerHeight + randomNumber(90, 210),
                rotate: `${randomNumber(160, 520)}deg`,
                duration: randomNumber(3.2, 5.4),
                color: randomPetalColor()
            });
        }, index * 38);
    }
}

function romanticSparkles(flower) {
    const { x, y } = getFlowerCenter(flower);

    for (let index = 0; index < 18; index += 1) {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty("--spark-x", `${randomNumber(-74, 74)}px`);
        sparkle.style.setProperty("--spark-y", `${randomNumber(-76, 42)}px`);
        document.body.appendChild(sparkle);
        removeAfterAnimation(sparkle, 1300);
    }
}

function celebrateReading() {
    petalRain();
    window.setTimeout(petalRain, 850);
    thanksMessage.classList.add("visible");
}

function createPetal({ x, y, fallX, fallY, rotate, duration, color }) {
    const petal = document.createElement("span");
    petal.className = "effect-petal";
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.setProperty("--fall-x", `${fallX}px`);
    petal.style.setProperty("--fall-y", `${fallY}px`);
    petal.style.setProperty("--fall-rotate", rotate);
    petal.style.setProperty("--fall-duration", `${duration}s`);
    petal.style.setProperty("--fall-color", color);
    petalStage.appendChild(petal);
    removeAfterAnimation(petal, duration * 1000 + 250);
}

function getFlowerCenter(flower) {
    const box = flower.getBoundingClientRect();
   return {
        x: box.left + box.width / 2,
        y: box.top + box.height * 0.22
    };
}

function randomPetalColor() {
    return Math.random() > 0.5
        ? "linear-gradient(145deg, #ffffff, #ffe2ec)"
        : "linear-gradient(145deg, #f47794, #b91d45)";
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function removeAfterAnimation(element, delay) {
    window.setTimeout(() => {
        element.remove();
    }, delay);
}
