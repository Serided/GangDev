const defSpawnRate = 2000;
const defSize = 15;
let spawnRate = defSpawnRate;
let size = defSize;
let heartSpawning = false;
let currentTimeout;

let combo = 0;
const comboTracker = document.getElementById("comboTracker");
let comboTrackerActive = false;

let attributeStack = [];
const attributeContainer = document.getElementById("attributeContainer");
const attributes = ["Pretty", "Smort", "Kind", "Funny", "Jacked AF", "Gorgeous", "Beautiful", "Shapely", "Interesting", "Perfect"];
const redFlags = ["Bad at RPS", "Mad cus bad", "Says I cap", "Thinks she loves me more"];

const pop = new Audio('../files/audio/pop.mp3');
pop.volume = 0.1;

function spawnHeart() {
    if (heartSpawning) return;
    heartSpawning = true;

    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }

    const oldHeart = document.querySelector(".heart")
    if (oldHeart) {
        oldHeart.classList.add("disappearing");
        setTimeout(() => oldHeart.remove(), spawnRate / 5);
    }

    const windowRef = document.getElementById("windowRef");
    const values = document.getElementById("values");
    const heart = document.createElement("div");
    updateComboEffects(heart);
    heart.innerHTML = `❤`;// <span>${attributes[Math.floor(Math.random() * attributes.length)]}</span>

    const x = (Math.random() * values.clientWidth) + ((windowRef.clientWidth - values.clientWidth) / 2);
    const y = (Math.random() * values.clientHeight) + ((windowRef.clientHeight - values.clientHeight) / 2);
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.transform = `translate(-50%, -50%)`;
    heart.style.fontSize = `${Math.max(3, size)}vh`;

    heart.addEventListener("click", () => {
        if (!heart.classList.contains("clicked") && !heart.classList.contains("disappearing") && !heart.classList.contains("spawning")) {
            comboHeart(heart);
        }
    });

    document.getElementById("values").appendChild(heart);
    setTimeout(() => heart.classList.add("spawned"), 10);

    currentTimeout = setTimeout(() => {
        if (heart.parentNode) {
            resetHeart(heart);
        }
    }, spawnRate);
}

function resetHeart(heart) {
    combo = 0; // reset if missed
    heart.classList.add("disappearing");
    setTimeout(() => heart.remove(), 300);
    size = defSize;
    spawnRate = defSpawnRate;
    resetComboTracker();
    resetAttributes();
    heartSpawning = false;
    spawnHeart();
}

function comboHeart(heart) {
    combo++;
    heart.classList.add("clicked");
    setTimeout(() => heart.remove(), 200);
    pop.play();
    size -= 0.175;
    spawnRate = Math.max(500, spawnRate * 0.98);
    updateComboTracker()
    if (combo >= 9) addAttribute();
    heartSpawning = false;
    spawnHeart();
}

function updateComboEffects(heart) {
    heart.classList.add("heart");
    if (combo >= 9) {
        heart.classList.add("combo");
    }
    if (combo >= 16) {
        heart.classList.add("I");
    }
    if (combo >= 25) {
        heart.classList.add("II");
    }
    if (combo >= 36) {
        heart.classList.add("III");
    }
    if (combo >= 49) {
        heart.classList.add("IV");
    }
    if (combo >= 64) {
        heart.classList.add("V");
    }
    if (combo >= 81) {
        heart.classList.add("VI");
    }
    if (combo >= 100) {
        heart.classList.add("VII");
    }
    if (combo >= 121) {
        heart.classList.add("VIII");
    }
    if (combo >= 144) {
        heart.classList.add("IX");
    }
    if (combo >= 169) {
        heart.classList.add("X");
    }
}

function updateComboTracker() {
    comboTracker.textContent = `x${combo}`
    if (combo >= 9 && !comboTrackerActive) {
        comboTrackerActive = true;
        comboTracker.style.transform = `translateX(0%)`;
        comboTracker.style.opacity = `1`
        attributeContainer.style.opacity = `1`
    }
}

function addAttribute() {
    const attribute = attributes[Math.floor(Math.random() * attributes.length)];
    const attributeElement = document.createElement("div");
    attributeElement.classList.add("attribute");
    attributeElement.textContent = attribute;

    // add attribute to stack
    attributeStack.push(attributeElement);
    attributeContainer.appendChild(attributeElement);
}

function resetComboTracker() {
    comboTracker.style.transform = `translateX(100%)`;
    comboTracker.style.opacity = `0`;
    comboTrackerActive = false;
}

function resetAttributes() {
    attributeStack.forEach(attribute => {
        attribute.style.transform = `translateX(100%)`; // slide out attributes
        setTimeout(() => attribute.remove(), 200);
    });
    attributeStack = [];
    attributeContainer.style.opacity = `0`;
}

function gameLoop() {
    if (!heartSpawning) {
        spawnHeart();
    }
}

gameLoop();