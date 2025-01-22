class WordpoolGame {
    constructor() {
        this.currentDataIndex = 0;
        this.score = 0;
        this.selectedWords = [];
        this.remainingSentences = 0;
        this.gameItems = [];
        this.totalItems = 4; // Number of items per round (between 3-5)
        this.totalPossibleScore = 0;
        // Footer copyright
        const currentYear = new Date().getFullYear();
        const copyrightYear = document.getElementById('copyright-year');
        copyrightYear.textContent = currentYear > 2025 ? `2025-${currentYear}` : '2025';
        this.init();
    }

    init() {
        this.setupDarkMode();
        this.setupEventListeners();
        this.selectRandomItems();
        this.loadCurrentQuestion();
    }

    selectRandomItems() {
        // Create array of indices and shuffle them
        const indices = Array.from({ length: data.length }, (_, i) => i);
        this.shuffleArray(indices);
        
        // Take first 3-5 items
        this.totalItems = Math.floor(Math.random() * 3) + 3; // Random number between 3-5
        this.gameItems = indices.slice(0, this.totalItems).map(i => data[i]);
        
        // Calculate total possible score from selected items
        this.totalPossibleScore = this.gameItems.reduce((total, item) => total + item.sentences.length, 0);
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const progress = (this.currentDataIndex / this.totalItems) * 100;
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${this.currentDataIndex + 1} of ${this.totalItems}`;
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
        if (this.currentDataIndex >= this.totalItems) {
            this.showGameComplete();
            return;
        }

        const currentData = this.gameItems[this.currentDataIndex];
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
        this.updateProgress();
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
        const currentData = this.gameItems[this.currentDataIndex];
        
        if (currentData.sentences.includes(currentSentence)) {
            // Trigger success animations
            this.animateSuccess();
            
            this.score++;
            this.remainingSentences--;
            this.updateRemainingSentences();
            
            // Delay reset to allow animations to complete
            setTimeout(() => {
                this.selectedWords = [];
                this.updateSentenceArea();
                this.displayWordPool(this.shuffleArray([...this.currentWords]));
                
                if (this.remainingSentences === 0) {
                    this.nextQuestion();
                }
            }, 1000);
        }
    }

    animateSuccess() {
        // Animate sentence area
        const sentenceArea = document.getElementById('sentenceArea');
        sentenceArea.classList.add('success');
        setTimeout(() => sentenceArea.classList.remove('success'), 1000);

        // Animate remaining count
        const remainingCount = document.getElementById('remainingSentences');
        remainingCount.classList.add('remaining-count-animate');
        setTimeout(() => remainingCount.classList.remove('remaining-count-animate'), 500);

        // Animate words to fade out
        const words = sentenceArea.querySelectorAll('.sentence-word');
        words.forEach(word => {
            word.classList.add('word-fade-out');
        });
    }

    updateRemainingSentences() {
        const remainingElement = document.getElementById('remainingSentences');
        const newCount = `Remaining sentences: ${this.remainingSentences}`;
        
        // Only animate if content is changing
        if (remainingElement.textContent !== newCount) {
            remainingElement.textContent = newCount;
        }
    }

    nextQuestion() {
        this.remainingSentences = 0; // Reset before loading next question
        this.currentDataIndex++;
        this.loadCurrentQuestion();
    }

    showGameComplete() {
        // Update progress to 100% before showing score screen
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        progressBar.style.width = '100%';
        progressText.textContent = `Complete!`;

        // Short delay before showing score screen
        setTimeout(() => {
            document.querySelector('.game-container').style.display = 'none';
            const scoreScreen = document.getElementById('scoreScreen');
            scoreScreen.style.display = 'block';
            
            // Update score displays
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('totalPossible').textContent = this.totalPossibleScore;
            
            // Calculate and display success rate
            const successRate = (this.score / this.totalPossibleScore * 100).toFixed(1);
            document.getElementById('successRate').textContent = `${successRate}%`;
        }, 500);
    }

    restartGame() {
        this.currentDataIndex = 0;
        this.score = 0;
        document.querySelector('.game-container').style.display = 'block';
        document.getElementById('scoreScreen').style.display = 'none';
        this.selectRandomItems(); // Select new random items for new game
        this.loadCurrentQuestion();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => new WordpoolGame());
