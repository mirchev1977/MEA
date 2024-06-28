let currentIndex = 0;
let isPlaying = false;
let currentAudio = null;
let playEnglish = true; // Track which audio is currently playing
let isFirstLoad = true; // Track if it's the first load

const startButton = $('#start-button');
const sentenceList = $('#sentence-list');
const controlsContainer = $('.controls-container');
const origButton = $('#orig-button');
const openDemoButtonContainer = $('#open-demo-button-container');
const openDemoButton = $('#open-demo-button');
const appContainer = $('#app-container');
const bottomButtons = $('.bottom-buttons');
const closeDemoButton = $('#close-demo-button');

// Проверка дали всички елементи са намерени
if (!startButton.length || !sentenceList.length || !controlsContainer.length || !origButton.length || !openDemoButtonContainer.length || !openDemoButton.length || !appContainer.length || !bottomButtons.length || !closeDemoButton.length) {
    console.error("One or more required elements are missing from the DOM");
}

function moveButtonToCurrentSentence() {
    if (isFirstLoad) {
        isFirstLoad = false;
        return;
    }
    const currentSentenceContainer = $('.sentence-pair-container').eq(currentIndex);
    const playButtonContainer = currentSentenceContainer.find('.play-button-container');
    playButtonContainer.append(controlsContainer);
    currentSentenceContainer[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        startButton.html('((( &#9654; ))) Старт'); // Play button icon
        return;
    }

    if (currentAudio && currentAudio.paused) {
        currentAudio.play().then(() => {
            isPlaying = true;
            startButton.html('&#9208; Пауза'); // Pause button icon
        }).catch(error => console.error("Error playing audio:", error));
        return;
    }

    isPlaying = true;
    startButton.html('&#9208; Пауза'); // Pause button icon
    playNext();
}

function highlightSentence() {
    $('.sentence-pair').each((index, pair) => {
        $(pair).find('.english').removeClass('highlight-english');
        $(pair).find('.bulgarian').removeClass('highlight-bulgarian');
        $(pair).removeClass('title-english title-bulgarian');

        if (index === currentIndex) {
            $(pair).find('.english').addClass('highlight-english');
            $(pair).find('.bulgarian').addClass('highlight-bulgarian');
        }

        // Add title classes back if it's a title
        if (sentences[index] && sentences[index].title) {
            $(pair).addClass('title-english title-bulgarian');
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
    if ($(window).width() <= 600) {
        origButton.text("ОРИГИНАЛ");
    } else {
        origButton.text("ОРИГ");
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
    const activeButton = $(`#${activeButtonId}`);

    if (activeButton.length) {
        activeButton.addClass("active-button");
    }
}

function highlightSelectedPair(event) {
    $('.sentence-pair-container').removeClass('selected');
    $(event.currentTarget).addClass('selected');
}

function preventScrolling() {
    $('body').css('overflow', 'hidden');
}

function allowScrolling() {
    $('body').css('overflow', 'auto');
}

function showAppContainer() {
    appContainer.show();
    bottomButtons.show(); // Показване на бутоните за нивата
    openDemoButtonContainer.hide();
    allowScrolling();
}

function hideAppContainer() {
    appContainer.hide();
    bottomButtons.hide(); // Скриване на бутоните за нивата
    openDemoButtonContainer.show();
    preventScrolling();
}

$(window).on('resize', handleResize);
$(document).ready(() => {
    handleResize(); // Set the initial state
    highlightActiveButton(); // Highlight the active button

    const currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "index.html" || currentPath === "") {
        hideAppContainer();
    } else {
        showAppContainer();
    }

    openDemoButton.on('click', showAppContainer);
    closeDemoButton.on('click', hideAppContainer);

    if ($('#button-A1').length) {
        $('#button-A1').on('click', () => {
            if (appContainer.is(':visible')) {
                hideAppContainer();
            } else {
                showAppContainer();
            }
        });
    }

    sentences.forEach((sentence, index) => {
        const container = $('<div>', { class: 'sentence-pair-container' });
        container.on('click', highlightSelectedPair); // Add event listener for selection

        const sentencePair = $('<div>', { class: 'sentence-pair' });

        const englishDiv = $('<div>', { class: 'sentence english', text: sentence.english });
        const bulgarianDiv = $('<div>', { class: 'sentence bulgarian', text: sentence.bulgarian });

        if (sentence.title) {
            englishDiv.addClass('title-english').text(englishDiv.text().toUpperCase());
            bulgarianDiv.addClass('title-bulgarian').text(bulgarianDiv.text().toUpperCase());
        }

        const playButtonContainer = $('<div>', { class: 'play-button-container' });
        const playButton = $('<div>', { class: 'play-button', html: '((( &nbsp; &#9654; )))' }); // Play button icon
        playButton.on('click', () => selectSentence(index));

        playButtonContainer.append(playButton);
        container.append(playButtonContainer);
        container.append(sentencePair);
        sentencePair.append(englishDiv);
        sentencePair.append(bulgarianDiv);
        sentenceList.append(container);
    });

    // Move the controls container to the first sentence pair on page load
    controlsContainer.show(); // Ensure controls container is visible
    const firstSentenceContainer = $('.sentence-pair-container').first();
    if (firstSentenceContainer.length) {
        const playButtonContainer = firstSentenceContainer.find('.play-button-container');
        if (playButtonContainer.length) {
            playButtonContainer.append(controlsContainer);
        }
    }

    startButton.on('click', playAudio);
});
