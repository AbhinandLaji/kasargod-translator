// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker Registered');
    }).catch(error => {
        console.error('Service Worker Registration Failed:', error);
    });
}

// Kasargod Slang Dictionary
const kasargodSlangDictionary = {
    "നീ": "ഇജ്ജ്", "നിങ്ങൾ": "ഇങ്ങള്", "ഞാൻ": "ഞാന്", "എന്താണ്": "എന്തപ്പ", "എന്താ": "എന്തപ്പ",
    "എവിടെ": "ഏടെ", "അവിടെ": "അങ്ങ്", "ഇവിടെ": "ഇങ്ങ്", "വരുന്നു": "ബരുന്നു", "വരാം": "ബരാം",
    "വന്നു": "ബന്ന്", "പോകുന്നു": "പോണ്", "പോയി": "പോയിന്", "പോകാം": "പോവാം", "ചെയ്യുന്നു": "ആക്കുന്ന്",
    "കഴിച്ചു": "തിന്നു", "കഴിക്കാം": "തിന്നാം", "ചേട്ടൻ": "കാക്ക", "ചേട്ടാ": "കാക്കാ", "ചേച്ചി": "ഇത്താത്ത",
    "സുഹൃത്ത്": "ചങ്ങായി", "ചങ്ങാതി": "ബെസ്റ്റ്", "പൈസ": "കാസ്", "നന്നായിട്ടുണ്ട്": "ബല്ലാത്ത", "കൊള്ളാം": "ഉഷാർ",
    "ആണ്": "അത്രെ", "അല്ലേ": "അല്ലേപ്പാ", "ഇല്ല": "ഇല്ലെ", "ഉണ്ട്": "ഉണ്ടപ്പാ", "അവൻ": "ഓൻ",
    "അവൾ": "ഓള്", "അവർ": "ഓല്", "പറഞ്ഞു": "ചൊന്നം", "എന്തിനാണ്": "എന്തിനാപ്പാ", "വിളിച്ചു": "വിളിച്ച്",
    "എങ്ങനെ": "എങ്ങനെപ്പാ", "വേഗം": "ബേം", "ഇഷ്ടപ്പെട്ടു": "ഇഷ്ടായി", "എടുക്ക്": "എട്ക്ക്",
    "കൊണ്ടുവാ": "കൊണ്ടാ", "അമ്മ": "ഉമ്മ", "അച്ഛൻ": "ബാപ്പ", "മനസ്സിലായില്ല": "കത്തിയില്ല",
    "മനസ്സിലായോ": "കത്തിയോ", "സത്യമാണോ": "നേരാണോ", "വെറുതെ": "ചുമ്മാ"
};

// DOM elements
const inputText = document.getElementById('inputText');
const translateBtn = document.getElementById('translateBtn');
const resultContainer = document.getElementById('resultContainer');
const resultText = document.getElementById('resultText');
const noSlangMessage = document.getElementById('noSlangMessage');
const speakBtn = document.getElementById('speakBtn');
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');
const alertBox = document.getElementById('alertBox');
const alertMessage = document.getElementById('alertMessage');

// Reusable function to play audio
function playAudio(text) {
    if (!text) return;

    speakBtn.disabled = true;
    const originalContent = speakBtn.innerHTML;
    speakBtn.innerHTML = 'Playing...';

    const encodedText = encodeURIComponent(text);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ml&client=tw-ob`;
    const audio = new Audio(ttsUrl);

    audio.play()
        .then(() => {
            audio.onended = () => {
                speakBtn.disabled = false;
                speakBtn.innerHTML = originalContent;
            };
        })
        .catch(error => {
            console.error("Error playing audio:", error);
            speakBtn.disabled = false;
            speakBtn.innerHTML = originalContent;
            showAlert("Could not play audio. Please check your internet connection.");
        });
}

// Translate button event
translateBtn.addEventListener('click', () => {
    const originalText = inputText.value.trim();
    if (!originalText) return;

    resultContainer.classList.add('hidden');
    noSlangMessage.classList.add('hidden');

    const words = originalText.split(/(\s+)/);
    let slangFound = false;

    const translatedWords = words.map(word => {
        const punctuation = word.match(/[.,?!;:]*$/)[0] || '';
        const cleanWord = word.replace(/[.,?!;:]*$/, '');
        if (kasargodSlangDictionary[cleanWord]) {
            slangFound = true;
            return kasargodSlangDictionary[cleanWord] + punctuation;
        }
        return word;
    });

    const translatedSentence = translatedWords.join('');
    if (slangFound) {
        resultText.textContent = translatedSentence;
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('fade-in');
    } else {
        noSlangMessage.classList.remove('hidden');
        noSlangMessage.classList.add('fade-in');
    }
});

// Speak button event
speakBtn.addEventListener('click', () => {
    playAudio(resultText.textContent);
});

// Copy button event
copyBtn.addEventListener('click', () => {
    if (!resultText.textContent) return;

    navigator.clipboard.writeText(resultText.textContent).then(() => {
        copyBtnText.textContent = 'Copied!';
        setTimeout(() => {
            copyBtnText.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showAlert("Could not copy text to clipboard.");
    });
});

// Alert box display function
function showAlert(message) {
    alertMessage.textContent = message;
    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.style.opacity = '1';
        alertBox.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(-20px)';
        setTimeout(() => alertBox.classList.add('hidden'), 300);
    }, 5000);
}

// ✅ Add background Malayalam letters on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('floating-letters-bg');
    const letters = ['ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ', 'ധ', 'ന', 'പ', 'ഫ', 'ബ', 'ഭ', 'മ', 'യ', 'ര', 'ല', 'വ', 'ശ', 'ഷ', 'സ', 'ഹ', 'ള', 'ഴ', 'റ'];

    const lines = 4;
    for (let i = 0; i < lines; i++) {
        const line = document.createElement('span');
        line.classList.add('floating-letter', `line${i + 1}`);
        const repeatedLetters = Array(3).fill(letters).flat().sort(() => 0.5 - Math.random());
        line.textContent = repeatedLetters.join('   ');
        bgContainer.appendChild(line);
    }
});
