
// The Quote class fetches a random quote from an API and returns it.
class Quote {
  constructor(apiUrl) {
    this._apiUrl = apiUrl;
  }
  
  async _getRandomQuote() {
    const response = await fetch(this._apiUrl);
    const data = await response.json();
    return data.content;
  }
  
  async getNextQuote() {
    const quote = await this._getRandomQuote();
    return quote;
  }
}

// The QuoteRenderer class takes a quote and renders it on the screen.
class QuoteRenderer {
  constructor(displayElement, inputElement) {
    this._displayElement = document.getElementById(displayElement);
    this._inputElement = document.getElementById(inputElement);
  }
  
  render(quote) {
    // Clear the input element's value.
    this._inputElement.value = '';

    // Clear the display element of any previous quote.
    this._displayElement.innerHTML = '';

    // Iterate over each character in the quote.
    quote.split('').forEach((character) => {
      // Create a new span element for the character and set its text.
      const characterSpan = document.createElement('span');
      characterSpan.innerText = character;

      // Add the span element to the display element.
      this._displayElement.appendChild(characterSpan);
    });
  }
}
// The TypingGame class manages the game logic.
class TypingGame {
  constructor(apiUrl, displayElement, inputElement, mistakesElement, timerElement, tryAgainButton, wpmElement) {
    // Create a new Quote instance to fetch quotes.
   
    this._quote = new Quote(apiUrl);
    // Create a new QuoteRenderer instance to render quotes.
    this._renderer = new QuoteRenderer(displayElement, inputElement);
    // Initialize the mistakes array.
    this._mistakesArray = [];
    // Get the mistake element from the DOM.
    this._mistakesElement = document.querySelector(mistakesElement);
    this._timerElement = document.querySelector(timerElement);
    // Initialize the timer variables.
    this._timer = null;
    this._isTimerRunning = false;
    this._tryAgainButton =document.getElementById(tryAgainButton)
    this._wpmElement=document.querySelector(wpmElement);
  
   
  }
  timer() {
    const startTime = new Date();
    this._timerElement.innerText = 60;
    this._isTimerRunning = true;

    this._timer = setInterval(() => {
      this._timerElement.innerText = this.getTimerTime(startTime);
      if (this._timerElement.innerText == 0 || this.checkMatch()) {
        this.endTimer();
      }
    }, 1000);
  }

  endTimer() {
    this._renderer._inputElement.disabled = true;
    clearInterval(this._timer);
    this._isTimerRunning = false; // Reset the timer running flag.
  }

  // This method calculates the remaining time.
  getTimerTime(startTime) {
    return Math.max(0, 60 - Math.round((new Date() - startTime) / 1000));
  }

  checkMatch() {
    const quote = this._renderer._displayElement.innerText.trim();
    const input = this._renderer._inputElement.value.trim();
    return quote === input;
  }
  compareWords(){
    const arrayQuoteWords = this._renderer._displayElement.innerText.split(" ");
    const arrayInputWords = this._renderer._inputElement.value.split(" ")
    var count=0;
    arrayInputWords.forEach((answer, i) => {
      if (answer === arrayQuoteWords[i]) {
        count++;  
      }
    });
    
    return count;
  }
  calculateWPM(){
    // Get the remaining time from the timer element, subtract it from 60 to get the time elapsed
    const getTimer=60-this._timerElement.innerText;
    const wordCount=this.compareWords();
    // Calculate the WPM value by dividing the word count by the time elapsed (in minutes), and rounding to the nearest integer
    const wpmValue=Math.round((wordCount/(getTimer/60)));
    // Set the WPM element's text to the calculated WPM value
    this._wpmElement.innerText = isNaN(wpmValue) ? 0 : wpmValue;
  }

  // This method colors the characters based on whether they are correct or incorrect.
  colourMistakes() {
    const arrayQuote = this._renderer._displayElement.querySelectorAll('span');
    const arrayValue = this._renderer._inputElement.value.split('');

    arrayQuote.forEach((characterSpan, index) => {
      const character = arrayValue[index];

      if (character == null) {
        characterSpan.classList.remove('correct');
        characterSpan.classList.remove('incorrect');
      } else if (character === characterSpan.innerText) {
        characterSpan.classList.add('correct');
        characterSpan.classList.remove('incorrect');
      } else {
        characterSpan.classList.remove('correct');
        characterSpan.classList.add('incorrect');
        if (!this._mistakesArray.includes(index)) {
          this._mistakesArray.push(index);
        }
        this._mistakesElement.textContent = this._mistakesArray.length;
      }
    });
  }

  // This method starts the game.
  async start() {
    // Fetch a new quote from the Quote instance.
    const mainQuote = await this._quote.getNextQuote();
    // Render the quote using the QuoteRenderer instance.
    this._renderer.render(mainQuote);
    this._mistakesElement.textContent= 0;
    this._timerElement.innerText=60;
    this._renderer._inputElement.disabled = false;
    this._renderer._inputElement.focus();
    // Listen for input events on the input element.
    this._renderer._inputElement.addEventListener('input', () => {
      // Colour the characters based on whether they are correct or incorrect.
      this.colourMistakes();    
        // Start the timer if it's not already running.
      if (!this._isTimerRunning) {
        this.timer();
      }
    });
    this._renderer._inputElement.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        alert("Error: Enter key is disabled.");
      }
    });
    this._everySecond = setInterval(() => {
      this.calculateWPM();
    }, 1000);
  }
}

// When the window loads, create a new TypingGame instance and start the game.
window.onload = function() {



  const game = new TypingGame(
    'http://api.quotable.io/random', // URL of the quote API
    'quoteDisplay', // ID of the element to display the quote
    'quoteInput', // ID of the input element to type the quote 
    '.mistake span',
    '.time span b',
    'tryAgain',
    '.wpm span',


  );
  
  
  game.start(); // Start the game.
  game._tryAgainButton.addEventListener('click', () => {
    game.start();
  });
};
