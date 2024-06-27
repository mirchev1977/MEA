let currentIndex = 0;
let isPlaying = false;
let currentAudio = null;
let playEnglish = true; // Track which audio is currently playing
let isFirstLoad = true; // Track if it's the first load

const startButton = document.getElementById('start-button');
const sentenceList = document.getElementById('sentence-list');
const controlsContainer = document.querySelector('.controls-container');
const origButton = document.getElementById('orig-button');
const openDemoButtonContainer = document.getElementById('open-demo-button-container');
const openDemoButton = document.getElementById('open-demo-button');
const appContainer = document.getElementById('app-container');
const bottomButtons = document.querySelector('.bottom-buttons');
const closeDemoButton = document.getElementById('close-demo-button');

function moveButtonToCurrentSentence() {
    if (isFirstLoad) {
        isFirstLoad = false;
        return;
    }
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
        if (sentences[index] && sentences[index].title) {
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
    const buttons = {
        "index.html": "button-A1",
        "A2.html": "button-A2",
        "B1.html": "button-B1",
        "B2.html": "button-B2",
        "C1.html": "button-C1",
        "C2.html": "button-C2",
        "ORIG.html": "orig-button"
    };

    const activeButtonId = buttons[currentPath] || "button-A1";
    const activeButton = document.getElementById(activeButtonId);

    if (activeButton) {
        activeButton.classList.add("active-button");
    }
}

function highlightSelectedPair(event) {
    document.querySelectorAll('.sentence-pair-container').forEach((container) => {
        container.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function showAppContainer() {
    if (appContainer) {
        appContainer.style.display = 'block';
    }
    if (bottomButtons) {
        bottomButtons.style.display = 'flex'; // Показване на бутоните за нивата
    }
    if (openDemoButtonContainer) {
        openDemoButtonContainer.style.display = 'none';
    }
    localStorage.setItem('appState', 'open');
}

function hideAppContainer() {
    if (appContainer) {
        appContainer.style.display = 'none';
    }
    if (bottomButtons) {
        bottomButtons.style.display = 'none'; // Скриване на бутоните за нивата
    }
    if (openDemoButtonContainer) {
        openDemoButtonContainer.style.display = 'flex';
    }
    localStorage.setItem('appState', 'closed');
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', () => {
    handleResize(); // Set the initial state
    highlightActiveButton(); // Highlight the active button

    // Изчистване на състоянието при зареждане на страницата
    if (performance.navigation.type === 1) {
        localStorage.removeItem('appState');
    }

    const appState = localStorage.getItem('appState');
    if (appState === 'open') {
        showAppContainer();
    } else {
        hideAppContainer();
    }

    if (openDemoButton) {
        openDemoButton.addEventListener('click', () => {
            showAppContainer();
            localStorage.setItem('appState', 'open'); // Запазване на състоянието при отваряне
        });
    }

    if (closeDemoButton) {
        closeDemoButton.addEventListener('click', () => {
            hideAppContainer();
            localStorage.setItem('appState', 'closed'); // Запазване на състоянието при затваряне
        });
    }

    sentences.forEach((sentence, index) => {
        const container = document.createElement('div');
        container.className = 'sentence-pair-container';
        container.addEventListener('click', highlightSelectedPair); // Add event listener for selection

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
        playButton.innerHTML = '((( &nbsp; &#9654; )))'; // Play button icon
        playButton.addEventListener('click', () => selectSentence(index));

        playButtonContainer.appendChild(playButton);

        container.appendChild(playButtonContainer);
        container.appendChild(sentencePair);
        sentencePair.appendChild(englishDiv);
        sentencePair.appendChild(bulgarianDiv);
        sentenceList.appendChild(container);
    });

    // Move the controls container to the first sentence pair on page load
    controlsContainer.style.display = 'block'; // Ensure controls container is visible
    const firstSentenceContainer = document.querySelector('.sentence-pair-container');
    if (firstSentenceContainer) {
        const playButtonContainer = firstSentenceContainer.querySelector('.play-button-container');
        if (playButtonContainer) {
            playButtonContainer.appendChild(controlsContainer);
        }
    }

    startButton.addEventListener('click', playAudio);
});
