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
        startButton.textContent = "Start";
        return;
    }

    if (currentAudio && currentAudio.paused) {
        currentAudio.play().then(() => {
            isPlaying = true;
            startButton.textContent = "Pause";
        }).catch(error => console.error("Error playing audio:", error));
        return;
    }

    isPlaying = true;
    startButton.textContent = "Pause";
    playNext();
}

function highlightSentence() {
    document.querySelectorAll('.sentence-pair').forEach((pair, index) => {
        pair.querySelector('.english').classList.remove('highlight-english');
        pair.querySelector('.bulgarian').classList.remove('highlight-bulgarian');
        if (index === currentIndex) {
            pair.querySelector('.english').classList.add('highlight-english');
            pair.querySelector('.bulgarian').classList.add('highlight-bulgarian');
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

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', () => {
    handleResize(); // Set the initial state

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

        const playButtonContainer = document.createElement('div');
        playButtonContainer.className = 'play-button-container';

        const playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '▶️'; // Play button icon
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

