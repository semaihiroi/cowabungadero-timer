// Timing constants
let workDuration = 0 * 60;
let shortBreak = 0 * 60;
let longBreak = 0 * 60;
const cyclesBeforeLong = 4;

// State variables
let timeLeft = workDuration;
let timer = null;
let phase = 'Work'; // 'Work', 'Break', 'LongBreak'
let cycleCount = 0;
let isRunning = false;
let typingInterval = null;
let party1 = '';
let party2 = '';
let transitionGif = 'gifs/explosion.gif';

// DOM elements
const timerDisplay = document.getElementById('timer');
const phaseBox = document.getElementById('phaseBox');
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');
const quoteBox = document.getElementById('quoteBox');
const portrait = document.getElementById('portrait');
const tpPercent = document.getElementById('tpPercent')

// Sounds
const alarm = document.getElementById('alarmSound');
const click = document.getElementById('clickSound');
const hover = document.getElementById('hoverSound');
const textS = document.getElementById('textSound');
const textTor = document.getElementById('textToriel');
const textSus = document.getElementById('textSusie');
const textRal = document.getElementById('textRalsei');
const textSpa = document.getElementById('textSpamton');
const textTen = document.getElementById('textTenna');
const textNoe = document.getElementById('textNoelle');

// More DOM elements
const gifKris = document.getElementById('gifKris');
const gifParty1 = document.getElementById('gifSusie');
const gifParty2 = document.getElementById('gifRalsei');
const gifRight = document.getElementById('gifRight');
const workTimeSet = document.getElementById('work-time-set');
const sBreakTimeSet = document.getElementById('s-break-time-set')
const lBreakTimeSet = document.getElementById("l-break-time-set");
const partyButton1 = document.getElementById('butt1');
const partyButton2 = document.getElementById('butt2');
const buttonRight = document.getElementById('buttRight');

// List sounds and decrease volume to 30%.
const sounds = [
    alarm,
    click,
    hover,
    textS
];

console.log(sounds);
for (s in sounds) {
    console.log(sounds[s]);
    sounds[s].volume = 0.3;
}

// Set up for sound to play when hovering over a button - won't work because of autoplay right now
/*const hoverTargets = document.querySelectorAll('.hover-btn');
console.log(hoverTargets);
hoverTargets.forEach(l => {
    l.addEventListener('mouseenter', () => {
        hover.currentTime = 0; // rewind to start
        hover.play();
    });
});*/

// Quotes for characters
const spamtonQuotes = {
    work: [
        "MAKE THE [$32 MSRP] DEAL OF YOUR LIFE!!!",
        "DON’T BE A [Little Sponge] — GRIND LIKE A [Big Shot]!!!",
        "NOW’S YOUR CHANCE TO BE A [Big Shot]!!!",
        "[Click Here] TO STAY ON TASK, [Hyperlink Blocked]."
    ],
    break: [
        "ENJOY YOUR [Federally Mandated] REST PERIOD!",
        "TAKE THE [Best Break Of Your Life]!"
    ]
};

const tennaQuotes = {
    work: [
        "Fresh from the juice, fresh from the juice!",
        "It's.... WORK. ING. TIIIIME!",
        "The WORK-O-METER is off the charts, folks!"
    ],
    break: [
        "Take five, superstar!",
        "Time for a backstage breather… Mike, are we live again?",
        "Let's give our contestant a break - don’t worry, I’ll keep the cameras rolling!"
    ]
};

const torielQuotes = {
    work: [
        "Steady work builds a strong foundation.",
        "Patience is the key to success.",
    ],
    break: [
        "Take a break, you've worked hard.",
        "Would you like some pie?",
        "Be like Snoriel and take a nap! Haha!"
    ]
};

const krisQuote = {
    work: [
        "..."
    ],
    break: [
        "..."
    ]
};

const susieQuotes = {
    work: [
        "Time to smash through this!",
        "I saved you some chalk.",
        "If you quit now, I’ll have to drag you back."
    ],
    break: [
        "I earned this. You didn’t. Kidding. Mostly.",
        "Ugh, finally.",
        "Which Dark World is this, anyway?"
    ]
};

const ralseiQuotes = {
    work: [
        "Every step forward counts.Even the little ones!",
        "I believe in you. Let’s keep going!",
        "You’re doing amazing! Just a bit more!"
    ],
    break: [
        "I’ll make some tea!",
        "Great job! Let’s take a little rest now."
    ]
};

const noelleQuotes = {
    work: [
        "O-Okay… time to focus! You can do it!",
        "This beats working with Berdly...",
        "We’re all in this together… I think!"
    ],
    break: [
        "I-I hope it’s okay to take a break now?",
        "Rest is scientifically good for memory! Probably!"
    ]
};

// Character data
const characters = [
    { name: 'Spamton', party: false, quotes: spamtonQuotes, imgGifWork: 'gifs/spamton_work.gif', imgGifBreak: 'gifs/spamton_break.png', voice: textSpa },
    { name: 'Tenna', party: false, quotes: tennaQuotes, imgGifWork: 'gifs/tenna_work.gif', imgGifBreak: 'gifs/tenna_break.gif', voice: textTen },
    { name: 'Toriel', party: false, quotes: torielQuotes, imgPortrait: 'gifs/toriel.gif', imgGifWork: 'gifs/toriel_work.gif', imgGifBreak: 'gifs/toriel_break.png', voice: textTor },
    { name: 'Kris', party: true, quotes: krisQuote, imgWork: 'gifs/kris_work.gif', imgShortBreak: 'gifs/kris_break.gif', imgLongBreak: 'gifs/kris_longbreak.png' },
    { name: 'Susie', party: true, quotes: susieQuotes, imgPortrait: 'gifs/susie.png', imgWork: 'gifs/susie_work.gif', imgShortBreak: 'gifs/susie_break.gif', imgLongBreak: 'gifs/susie_longbreak.png', voice: textSus },
    { name: 'Ralsei', party: true, quotes: ralseiQuotes, imgPortrait: 'gifs/ralsei.png', imgWork: 'gifs/ralsei_work.gif', imgShortBreak: 'gifs/ralsei_break.gif', imgLongBreak: 'gifs/ralsei_longbreak.png', voice: textRal },
    { name: 'Noelle', party: true, quotes: noelleQuotes, imgPortrait: 'gifs/noelle.png', imgWork: 'gifs/noelle_work.gif', imgShortBreak: 'gifs/noelle_break.png', imgLongBreak: 'gifs/noelle_longbreak.gif', voice: textNoe },
];

//split characters into party and not party

const partyMembers = characters.filter(c => c.party === true);
const otherPeeps = characters.filter(c => c.party === false);

// Break icon for portrait and right gif when on break
const breakIconPortrait = 'gifs/toriel.png';
const breakIconGif = 'gifs/toriel_break.png';

// Data for progress percentage meter
const progressBar = document.getElementById('progressMeter');
let phaseDuration = 1;

// Current chosen character for right side
let currentCharacter = otherPeeps[0];

// Helper: pick random item from array
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Types out the quote in the box
function typeQuote(text, character, element) {
    // Clear any previous typing interval
    if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    // Type text character by character
    element.textContent = '';
    let i = 0;
    let voice = textS;
    console.log(voice);
    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i++];
            if (character.voice !== undefined) {
                voice = character.voice;
            }
            // Play voice sound during typing
            if (i % 6 === 0) {
                voice.currentTime = 0; // rewind
                voice.play().catch(e => {
                    // Ignore errors like "play() interrupted by user gesture"
                });
            }
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
        }
    }, 30);
}

function updateQuoteBox(character) {

    // Set variable
    let quote = '...';
    // Update portrait
    portrait.src = character.imgPortrait;

    // Pick a random quote from the phase's pool and display it
    if (phase === 'Work'){
        quote = randomChoice(character.quotes.work);
    } else {
        quote = randomChoice(character.quotes.break);
    }
    typeQuote(quote, character, quoteBox);
}

// Show the elapsed time on the tab title if the current phase has started
function updateTitleTime(mins, secs) {
    if (isRunning) {
        document.title = `${mins}:${secs} | Deltarune Pomodoro Timer`
    } else {
        document.title = 'Deltarune Pomodoro Timer'
    }
}

// Update the time on the timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    updateTitleTime(minutes, seconds);
}

// Create a new gif per phase, so single-play animations still run. Could probably be implemented better without so much using cache?
function resetGifs() {
    const cacheBuster = new Date().getTime(); // unique timestamp
    gifKris.src = `${gifKris.src}?cb=${cacheBuster}`;
    gifParty1.src = `${gifParty1.src}?cb=${cacheBuster}`;
    gifParty2.src = `${gifParty2.src}?cb=${cacheBuster}`;
    console.log(gifKris.src);
    transitionGif = `gifs/explosion.gif?cb=${cacheBuster}`;

  }

// Update phase notification
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

// Update the sprites of the party members based on the phase. Could be improved with variables and a helper function.
function updateParty() {
    if (phase === 'Work') {
        gifKris.src = partyMembers[0].imgWork;
        gifSusie.src = partyMembers.find(c => c.name === party1).imgWork;
        gifRalsei.src = partyMembers.find(c => c.name === party2).imgWork;
    } else if (phase === 'Break') {
        gifKris.src = partyMembers[0].imgShortBreak;
        gifSusie.src = partyMembers.find(c => c.name === party1).imgShortBreak;
        gifRalsei.src = partyMembers.find(c => c.name === party2).imgShortBreak;
    } else {
        gifKris.src = partyMembers[0].imgLongBreak;
        gifSusie.src = partyMembers.find(c => c.name === party1).imgLongBreak;
        gifRalsei.src = partyMembers.find(c => c.name === party2).imgLongBreak;
    }
    resetGifs();
}

// Update all visual elements at once
function updateAllVisuals() {
    updateTimerDisplay();
    updatePhaseBox();
    updateQuoteBox(currentCharacter);
    updateParty();
}

// Shows a transition for the right side character.
function playPhaseTransition() {
    gifRight.src = transitionGif;

    quoteBox.textContent = '';
    portrait.src = 'a.jpg';
    if (typingInterval !== null) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    setTimeout(() => {
        chooseCharacter();
        updateAllVisuals(); 
    }, 1280); 
  }

// Change phase of the timer
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
    
    alarm.play();
    playPhaseTransition();
}

// Skip a phase
function skipPhase() {
    click.play();
    switchPhase();
}

// Open info window
function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

// Close info window
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    localStorage.setItem("SeenPopUp", true);
}

// Open settings window
function openSettings() {
    document.getElementById('menu').style.display = 'flex';
}

// Close settings window
function closeSettings() {
    document.getElementById('menu').style.display = 'none';
}

// Shows the percent progress of the current phase on the TP meter.
function updateProgressMeter() {
    const progress = 1 - (timeLeft / phaseDuration);
    progressBar.style.transform = `scaleY(${progress})`;
    const percentProgress = Math.floor(progress*100).toString();
    tpPercent.textContent = `${percentProgress}`;
}

// Handles starting and pausing the timer
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

// Saves chosen settings to local storage
function saveSettings() {
    click.play();
    
    localStorage.setItem('WorkTime', workTimeSet.value);
    localStorage.setItem('ShortBreakTime', sBreakTimeSet.value);
    localStorage.setItem('LongBreakTime', lBreakTimeSet.value);

    updateTimes();
}

// Updates the timer when times are changed
function updateTimes() {
    workDuration = workTimeSet.value * 60;
    shortBreak = sBreakTimeSet.value * 60;
    longBreak = lBreakTimeSet.value * 60;
    timeLeft = workDuration;
    phaseDuration = workDuration;
    updateTimerDisplay();
}

// Choose two characters from the party list for the left side
function chooseParty() {
    let friends = ['Ralsei', 'Susie', 'Noelle'];
    party1 = randomChoice(friends);
    while (party2 === '' || party2 === party1) {
        party2 = randomChoice(friends);
    }
    console.log(party1 + " " + party2);
    partyButton1.title = party1;
    partyButton1.onclick = function () { clickChar(party1); };
    partyButton2.title = party2;
    partyButton2.onclick = function () { clickChar(party2); };
    updateParty();
}

// Choose a character from the list for the right side
function chooseCharacter() {
    currentCharacter = randomChoice(otherPeeps);
    if (phase === 'Work') {
        gifRight.src = currentCharacter.imgGifWork;
    } else {
        gifRight.src = currentCharacter.imgGifBreak;
    }
    buttonRight.title = currentCharacter.name;
    buttonRight.onclick = function () { clickChar(currentCharacter.name); };
    console.log(buttonRight.onclick);
}

// Handles clicking any character onscreen
function clickChar(character) {
    console.log('You clicked ' + character);
    updateQuoteBox(characters.find(c => c.name === character));
}

// Initialize

window.onload = (event) => {
    console.log(localStorage.getItem('SeenPopUp'));
    if (localStorage.getItem('SeenPopUp') == 'true') {
        document.getElementById('popup').style.display = 'none';
    } else {
        document.getElementById('popup').style.display = 'flex';
    }
    
    if (localStorage.getItem('WorkTime') === null) {
        workTimeSet.value = 25;
        sBreakTimeSet.value = 5;
        lBreakTimeSet.value = 15;
    } else {
        workTimeSet.value = localStorage.getItem('WorkTime');
        sBreakTimeSet.value = localStorage.getItem('ShortBreakTime');
        lBreakTimeSet.value = localStorage.getItem('LongBreakTime');
    }

    updateTimes();
    chooseParty();
    chooseCharacter();
    updateAllVisuals();
};


