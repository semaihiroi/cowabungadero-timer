// Timing constants
const workDuration = 25 * 60;
const shortBreak = 5 * 60;
const longBreak = 15 * 60;
const cyclesBeforeLong = 4;

// State variables
let timeLeft = workDuration;
let timer = null;
let phase = 'Work'; // 'Work', 'Break', 'LongBreak'
let cycleCount = 0;
let isRunning = false;
let typingInterval = null;

// DOM elements
const timerDisplay = document.getElementById('timer');
const phaseBox = document.getElementById('phaseBox');
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');
const quoteBox = document.getElementById('quoteBox');
const portrait = document.getElementById('portrait');
const alarm = document.getElementById('alarmSound');
const click = document.getElementById('clickSound');
const tpPercent = document.getElementById('tpPercent')

const gifKris = document.getElementById('gifKris');
const gifSusie = document.getElementById('gifSusie');
const gifRalsei = document.getElementById('gifRalsei');
const gifRight = document.getElementById('gifRight');

// Quotes and portraits for characters
const spamtonQuotes = [
    "Make the DEAL of your LIFE!",
    "WORKING? That's the [Hot New Thing]!",
    "You can't have [[Success]] without [[Pain]]!"
];

const tennaQuotes = [
    "Your DESTINY is only a heartbeat away.",
    "JUST BELIEVE in the [Cosmic Groove] and DANCE!",
    "You're not alone, my STARLIGHT."
];

const torielQuotes = [
    "Take a break, dear. You've worked hard.",
    "Don't forget to rest and eat something wholesome.",
    "Patience is the key to success, my child."
];

// Character data for right side GIF and portrait
const characters = [
    { name: 'Spamton', quotes: spamtonQuotes, imgPortrait: 'gifs/spamton.webp', imgGifWork: 'gifs/spamton_work.gif', imgGifBreak: 'gifs/spamton_break.png' },
    { name: 'Tenna', quotes: tennaQuotes, imgPortrait: 'gifs/tenna.png', imgGifWork: 'gifs/tenna_work.gif', imgGifBreak: 'tenna_break.gif' },
    { name: 'Toriel', quotes: torielQuotes, imgPortrait: 'gifs/toriel.gif', imgGifWork: 'gifs/toriel_work.gif', imgGifBreak: 'gifs/toriel_break.png' },
];

// Left side GIFs for phases
const leftGifs = {
    Work: {
        Kris: 'gifs/kris_work.gif',
        Susie: 'gifs/susie_work.gif',
        Ralsei: 'gifs/ralsei_work.gif',
    },
    Break: {
        Kris: 'gifs/kris_break.png',
        Susie: 'gifs/susie_break.png',
        Ralsei: 'gifs/ralsei_break.png',
    },
    LongBreak: {
        Kris: 'gifs/kris_longbreak.gif',
        Susie: 'gifs/susie_longbreak.gif',
        Ralsei: 'gifs/ralsei_longbreak.gif',
    }
};

// Break icon for portrait and right gif when on break
const breakIconPortrait = 'gifs/toriel.png';
const breakIconGif = 'gifs/toriel_break.png';

// Data for progress percentage meter
const progressBar = document.getElementById('progressMeter');
let phaseDuration = 60 * 25;

// Current chosen character for right side
let currentCharacter = characters[0];

//local variable for whether to display info popup

// Helper: pick random item from array
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function typeQuote(text, element) {
    // Clear any previous typing interval
    if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    //type text character by character
    element.textContent = '';
    let i = 0;
    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i++];
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
        }
    }, 30);
}

function updateQuoteBox() {
    if (phase === 'Work') {
        // Pick a random character and quote
        currentCharacter = randomChoice(characters);
        portrait.src = currentCharacter.imgPortrait;
        gifRight.src = currentCharacter.imgGifWork;
        const quote = randomChoice(currentCharacter.quotes);
        typeQuote(quote, quoteBox);
    } else {
        portrait.src = breakIconPortrait;
        gifRight.src = breakIconGif;
        typeQuote('Break time! ✨', quoteBox);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updatePhaseBox() {
    let nextPhase = '';
    if (phase === 'Work') {
        nextPhase = 'Break';
    } else if (phase === 'Break') {
        nextPhase = cycleCount >= cyclesBeforeLong ? 'Long Break' : 'Work';
    } else {
        nextPhase = 'Work';
    }
    phaseBox.textContent = `Phase: ${phase.replace('LongBreak', 'Long Break')} | Next: ${nextPhase}`;
}

function updateLeftGifs() {
    gifKris.src = leftGifs[phase]?.Kris || 'kris_work.gif';
    gifSusie.src = leftGifs[phase]?.Susie || 'susie_work.gif';
    gifRalsei.src = leftGifs[phase]?.Ralsei || 'ralsei_work.gif';
}

function updateAllVisuals() {
    updateTimerDisplay();
    updatePhaseBox();
    updateQuoteBox();
    updateLeftGifs();
}

function switchPhase() {
    if (phase === 'Work') {
        cycleCount++;
        if (cycleCount >= cyclesBeforeLong) {
            phase = 'LongBreak';
            timeLeft = longBreak;
            cycleCount = 0;
            phaseDuration = longBreak;
        } else {
            phase = 'Break';
            timeLeft = shortBreak;
            phaseDuration = shortBreak;
        }
    } else {
        phase = 'Work';
        timeLeft = workDuration;
        phaseDuration = workDuration;
    }
    updateAllVisuals();
    alarm.play();
}

function skipPhase() {
    click.play();
    switchPhase();
}

function openPopup() {
    document.getElementById('popup').style.display = 'flex';
    localStorage.setItem("SeenPopUp", false);
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    localStorage.setItem("SeenPopUp", true);
}

function openSettings() {
    document.getElementById('menu').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('menu').style.display = 'none';
}

function updateProgressMeter() {
    const progress = 1 - (timeLeft / phaseDuration);
    progressBar.style.transform = `scaleY(${progress})`;
    const percentProgress = Math.floor(progress*100).toString();
    tpPercent.textContent = `${percentProgress}`;
}

function toggleTimer() {
    click.play();
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'Start';
    } else {
        isRunning = true;
        startBtn.textContent = 'Pause';
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
                updateProgressMeter();
            } else {
                switchPhase();
            }
        }, 1000);
    }
}

// Initialize

window.onload = (event) => {
    console.log(localStorage.getItem('SeenPopUp'));
    if (localStorage.getItem('SeenPopUp') == 'true') {
        document.getElementById('popup').style.display = 'none';
    } else {
        document.getElementById('popup').style.display = 'flex';
    }
};

// Initial setup
updateAllVisuals();

