class WordpoolGame {
    constructor() {
        this.currentDataIndex = 0;
        this.score = 0;
        this.selectedWords = [];
        this.remainingSentences = 0;
        this.init();
    }

    init() {
        this.setupDarkMode();
        this.setupEventListeners();
        this.loadCurrentQuestion();
    }

    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('click', () => {
            document.body.setAttribute('data-theme',
                document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            );
        });
    }

    setupEventListeners() {
        document.getElementById('skipButton').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }

    loadCurrentQuestion() {
        if (this.currentDataIndex >= data.length) {
            this.showGameComplete();
            return;
        }

        const currentData = data[this.currentDataIndex];
        this.remainingSentences = currentData.sentences.length;
        this.updateRemainingSentences();
        this.selectedWords = [];
        this.displayWordPool(currentData.words);
        this.updateSentenceArea();
    }

    displayWordPool(words) {
        const wordPool = document.getElementById('wordPool');
        wordPool.innerHTML = '';
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            wordElement.addEventListener('click', () => this.handleWordClick(word));
            wordPool.appendChild(wordElement);
        });
    }

    handleWordClick(word) {
        this.selectedWords.push(word);
        this.updateSentenceArea();
        this.checkSentence();
    }

    updateSentenceArea() {
        const sentenceArea = document.getElementById('sentenceArea');
        sentenceArea.innerHTML = '';
        
        this.selectedWords.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'sentence-word';
            wordSpan.textContent = word;
            wordSpan.addEventListener('click', () => this.removeWord(index));
            
            if (index > 0) {
                sentenceArea.appendChild(document.createTextNode(' '));
            }
            
            sentenceArea.appendChild(wordSpan);
        });
    }

    removeWord(index) {
        this.selectedWords.splice(index, 1);
        this.updateSentenceArea();
        this.checkSentence();
    }

    checkSentence() {
        const currentSentence = this.selectedWords.join(' ');
        const currentData = data[this.currentDataIndex];
        
        if (currentData.sentences.includes(currentSentence)) {
            this.score++;
            this.remainingSentences--;
            this.updateRemainingSentences();
            
            if (this.remainingSentences === 0) {
                this.nextQuestion();
            } else {
                this.selectedWords = [];
                this.updateSentenceArea();
            }
        }
    }

    updateRemainingSentences() {
        document.getElementById('remainingSentences').textContent = 
            `Remaining sentences: ${this.remainingSentences}`;
    }

    nextQuestion() {
        this.currentDataIndex++;
        this.loadCurrentQuestion();
    }

    showGameComplete() {
        document.querySelector('.game-container').style.display = 'none';
        const scoreScreen = document.getElementById('scoreScreen');
        scoreScreen.style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
    }

    restartGame() {
        this.currentDataIndex = 0;
        this.score = 0;
        document.querySelector('.game-container').style.display = 'block';
        document.getElementById('scoreScreen').style.display = 'none';
        this.loadCurrentQuestion();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => new WordpoolGame());
