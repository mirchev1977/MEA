let currentIndex = 0;
let isPlaying = false;
let currentAudio = null;
let playEnglish = true; // Track which audio is currently playing

const startButton = document.getElementById('start-button');
const sentenceList = document.getElementById('sentence-list');
const controlsContainer = document.querySelector('.controls-container');
const origButton = document.getElementById('orig-button');

function moveButtonToCurrentSentence() {
    const currentSentenceContainer = document.querySelectorAll('.sentence-pair-container')[currentIndex];
    const playButtonContainer = currentSentenceContainer.querySelector('.play-button-container');
    playButtonContainer.appendChild(controlsContainer);
    currentSentenceContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playNext() {
    highlightSentence();
    if (playEnglish) {
        currentAudio = new Audio(sentences[currentIndex].audioEn);
        playEnglish = false;
    } else {
        currentAudio = new Audio(sentences[currentIndex].audioBg);
        playEnglish = true;
        currentIndex++;
        if (currentIndex >= sentences.length) {
            currentIndex = 0; // Loop back to the start if desired
        }
    }

    currentAudio.play().then(() => {
        currentAudio.onended = playNext;
    }).catch(error => console.error("Error playing audio:", error));
}

function playAudio() {
    if (isPlaying) {
        if (currentAudio) {
            currentAudio.pause();
        }
        isPlaying = false;
        startButton.innerHTML = '((( &#9654; ))) Старт'; // Play button icon
        return;
    }

    if (currentAudio && currentAudio.paused) {
        currentAudio.play().then(() => {
            isPlaying = true;
            startButton.innerHTML = '&#9208; Пауза'; // Pause button icon
        }).catch(error => console.error("Error playing audio:", error));
        return;
    }

    isPlaying = true;
    startButton.innerHTML = '&#9208; Пауза'; // Pause button icon
    playNext();
}

function highlightSentence() {
    document.querySelectorAll('.sentence-pair').forEach((pair, index) => {
        pair.querySelector('.english').classList.remove('highlight-english');
        pair.querySelector('.bulgarian').classList.remove('highlight-bulgarian');
        pair.classList.remove('title-english', 'title-bulgarian');

        if (index === currentIndex) {
            pair.querySelector('.english').classList.add('highlight-english');
            pair.querySelector('.bulgarian').classList.add('highlight-bulgarian');
        }

        // Add title classes back if it's a title
        if (sentences[index].title) {
            pair.classList.add('title-english', 'title-bulgarian');
        }
    });
    moveButtonToCurrentSentence();
}

function selectSentence(index) {
    currentIndex = index;
    playEnglish = true; // Start with English audio
    playAudio();
}

function handleResize() {
    if (window.innerWidth <= 600) {
        origButton.textContent = "ОРИГИНАЛ";
    } else {
        origButton.textContent = "ОРИГ";
    }
}

function highlightActiveButton() {
    const currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "index.html" || currentPath === "") {
        const buttonA1 = document.getElementById("button-A1");
        if (buttonA1) buttonA1.classList.add("active-button");
    } else if (currentPath === "A2.html") {
        const buttonA2 = document.getElementById("button-A2");
        if (buttonA2) buttonA2.classList.add("active-button");
    } else if (currentPath === "B1.html") {
        const buttonB1 = document.getElementById("button-B1");
        if (buttonB1) buttonB1.classList.add("active-button");
    } else if (currentPath === "B2.html") {
        const buttonB2 = document.getElementById("button-B2");
        if (buttonB2) buttonB2.classList.add("active-button");
    } else if (currentPath === "C1.html") {
        const buttonC1 = document.getElementById("button-C1");
        if (buttonC1) buttonC1.classList.add("active-button");
    } else if (currentPath === "C2.html") {
        const buttonC2 = document.getElementById("button-C2");
        if (buttonC2) buttonC2.classList.add("active-button");
    } else if (currentPath === "ORIG.html") {
        if (origButton) origButton.classList.add("active-button");
    }
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', () => {
    handleResize(); // Set the initial state
    highlightActiveButton(); // Highlight the active button

    sentences.forEach((sentence, index) => {
        const container = document.createElement('div');
        container.className = 'sentence-pair-container';

        const sentencePair = document.createElement('div');
        sentencePair.className = 'sentence-pair';

        const englishDiv = document.createElement('div');
        englishDiv.className = 'sentence english';
        englishDiv.textContent = sentence.english;

        const bulgarianDiv = document.createElement('div');
        bulgarianDiv.className = 'sentence bulgarian';
        bulgarianDiv.textContent = sentence.bulgarian;

        if (sentence.title) {
            englishDiv.classList.add('title-english');
            bulgarianDiv.classList.add('title-bulgarian');
            englishDiv.textContent = englishDiv.textContent.toUpperCase();
            bulgarianDiv.textContent = bulgarianDiv.textContent.toUpperCase();
        }

        const playButtonContainer = document.createElement('div');
        playButtonContainer.className = 'play-button-container';

        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '((( &#9654; )))'; // Play button icon
        playButton.addEventListener('click', () => selectSentence(index));

        playButtonContainer.appendChild(playButton);

        container.appendChild(playButtonContainer);
        container.appendChild(sentencePair);
        sentencePair.appendChild(englishDiv);
        sentencePair.appendChild(bulgarianDiv);
        sentenceList.appendChild(container);
    });

    // Move the controls container to the first sentence pair on page load
    moveButtonToCurrentSentence();

    startButton.addEventListener('click', playAudio);
});

