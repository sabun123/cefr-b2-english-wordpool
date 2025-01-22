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

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    loadCurrentQuestion() {
        if (this.currentDataIndex >= data.length) {
            this.showGameComplete();
            return;
        }

        const currentData = data[this.currentDataIndex];
        // Only set remainingSentences if it's not already set (new question)
        if (this.remainingSentences === 0) {
            this.remainingSentences = currentData.sentences.length;
            this.updateRemainingSentences();
        }
        this.selectedWords = [];
        this.currentWords = [...currentData.words];
        // Display words in original order initially
        this.displayWordPool(this.currentWords);
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
            
            // Reset sentence area
            this.selectedWords = [];
            this.updateSentenceArea();
            
            // Only shuffle words after first successful sentence
            this.displayWordPool(this.shuffleArray([...this.currentWords]));
            
            if (this.remainingSentences === 0) {
                this.nextQuestion();
            }
        }
    }

    updateRemainingSentences() {
        document.getElementById('remainingSentences').textContent = 
            `Remaining sentences: ${this.remainingSentences}`;
    }

    nextQuestion() {
        this.remainingSentences = 0; // Reset before loading next question
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
