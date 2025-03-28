// Initialize necessary variables
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerResult = 0; // -1 lose, 0 tie, 1 win
let selectedBetAmount = 0;
let playerBet = 0;
let playerTotalScore = 0;
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['♤', '♢', '♡', '♧'];
let deck = [];

// Set up event listeners
function setupEventListeners() {
    document.getElementById('hit-button').addEventListener('click', hit);
    document.getElementById('stand-button').addEventListener('click', stand);
    document.getElementById('double-button').addEventListener('click', doubleDown);
    document.getElementById('confirm-bet-button').addEventListener('click', confirmBet);
    
    // Bet button listeners
    document.getElementById('add-bet').addEventListener('click', () => modifyBet('add'));
    document.getElementById('subtract-bet').addEventListener('click', () => modifyBet('subtract'));
    document.getElementById('clear-bet-button').addEventListener('click', clearBet);
    
    const betButtons = document.querySelectorAll('.betting-buttons button');
    betButtons.forEach(button => {
        button.addEventListener('click', () => setBetAmount(button));
    });

    // Modal listeners
    document.getElementById('open-strategy-button').addEventListener('click', showBlackjackBook);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target === document.getElementById('blackjack-modal')) closeModal() });
}

// Start the game
function startGame() {
    resetGame();
    deck = createDeck();
    shuffleDeck(deck);
    dealCards();
}

// Reset game variables
function resetGame() {
    gameOver = false;
    playerResult = 0;
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    showDealerScore = false;

    document.getElementById('status').textContent = '';
    document.getElementById('status').style.color = "black";
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').textContent = '';
    document.getElementById('dealer-score').textContent = '';
    document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`;
    disableButtons(false);
    // document.querySelector('.game-buttons').style.display = 'block';
}

// Create and shuffle deck
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of cards) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal cards
async function dealCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    await formatCards(playerHand, 'player-cards');
    await formatCards([dealerHand[0], { value: 'Hidden', suit: '' }], 'dealer-cards');
    updateScores();
    document.querySelector('.game-buttons').style.display = 'block';
}

// Format cards for HTML rendering
async function formatCards(hand, id, ms = 1000) {
    let formattedCards = '';
    for (let card of hand) {
        await sleep(ms);
        formattedCards += `<div class="card">${card.value} ${card.suit}</div>`;
        document.getElementById(id).innerHTML = formattedCards;
    }
}

// Sleep function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Calculate the score of a hand
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        const value = card.value;
        if (['J', 'Q', 'K'].includes(value)) {
            score += 10;
        } else if (value === 'A') {
            aces++;
            score += 11;
        } else {
            score += parseInt(value);
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Update scores
function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    document.getElementById('player-score').textContent = playerScore;

    if (showDealerScore) {
        document.getElementById('dealer-score').style.display = 'block';
        document.getElementById('dealer-score').textContent = dealerScore;
    }
}

// Hit
async function hit() {
    if (!gameOver) {
        playerHand.push(deck.pop());
        await formatCards(playerHand, 'player-cards', 0);
        updateScores();

        if (playerScore > 21) {
            gameOver = true;
            document.getElementById('status').textContent = "Player Bust! You lose.";
            playerTotalScore -= playerBet;
            document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`;
            disableButtons(true);
            displayBetButtons();
        }
    }
}

// Stand
async function stand() {
    disableButtons(true);
    await sleep(1000);
    showDealerScore = true;
    updateScores();

    if (!gameOver) {
        await formatCards(dealerHand, 'dealer-cards', 0);

        while (dealerScore < 17) {
            await sleep(1000);
            dealerHand.push(deck.pop());
            await formatCards(dealerHand, 'dealer-cards', 0);
            updateScores();
        }

        gameOver = true;
        determineWinner();
    }
}

// Double Down
async function doubleDown() {
    if (!gameOver) {
        playerHand.push(deck.pop());
        playerBet *= 2;
        updateCurrentBetDisplay();
        await formatCards(playerHand, 'player-cards', 0);
        updateScores();

        if (playerScore > 21) {
            gameOver = true;
            document.getElementById('status').textContent = "Player Bust! You lose.";
            playerTotalScore -= playerBet;
            document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`;
            disableButtons(true);
            displayBetButtons();
        } else {
            stand();
        }
    }
}

// Determine winner
function determineWinner() {
    if (dealerScore > 21) {
        document.getElementById('status').textContent = "Dealer Bust! You win.";
        playerResult = -1;
        playerTotalScore += playerBet;
    } else if (playerScore > dealerScore) {
        document.getElementById('status').textContent = "You win!";
        playerResult = 1;
        playerTotalScore += playerBet;
    } else if (playerScore < dealerScore) {
        document.getElementById('status').textContent = "You lose.";
        playerResult = -1;
        playerTotalScore -= playerBet;
    } else {
        document.getElementById('status').textContent = "It's a tie!";
        playerResult = 0;
    }
    if (playerResult == 0) {
        document.getElementById('status').style.color = "yellow";
    } else if (playerResult == -1) {
        document.getElementById('status').style.color = "red";
    } else {
        document.getElementById('status').style.color = "green";
    }

    document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`;
    playerBet = 0;
    updateCurrentBetDisplay();
    updateScores();
    disableButtons(true);
    displayBetButtons();
}

// Disable buttons
function disableButtons(value) {
    document.getElementById('hit-button').disabled = value;
    document.getElementById('stand-button').disabled = value;
    document.getElementById('double-button').disabled = value;
}

// Show bet buttons
function displayBetButtons() {
    document.querySelector('.betting-buttons').style.display = 'block';
    document.getElementById('confirm-bet-button').style.display = 'inline';
    document.getElementById('clear-bet-button').style.display = 'inline';
    document.getElementById('add-bet').style.display = 'inline';
    document.getElementById('subtract-bet').style.display = 'inline';
    document.querySelector('.game-buttons').style.display = 'none';
}

// Update the current bet display
function updateCurrentBetDisplay() {
    document.getElementById('current-bet').textContent = `Current Bet: $${playerBet}`;
}

// Modify bet
function modifyBet(action) {
    if (action === 'add') {
        playerBet += selectedBetAmount;
    } else if (action === 'subtract') {
        if (playerBet >= selectedBetAmount) {
            playerBet -= selectedBetAmount;
        }
    }
    updateCurrentBetDisplay();
}

// Set bet amount
function setBetAmount(button) {
    selectedBetAmount = parseInt(button.value);
    highlightBetButton(button);
}

// Highlight bet button
function highlightBetButton(selectedButton) {
    const betButtons = document.querySelectorAll('.betting-buttons button');
    betButtons.forEach(button => button.classList.remove('highlighted'));
    selectedButton.classList.add('highlighted');
}

// Clear bet
function clearBet() {
    playerBet = 0;
    updateCurrentBetDisplay();
}

// Confirm bet and start the game
function confirmBet() {
    if (playerBet > 0) {
        document.querySelector('.betting-buttons').style.display = 'none';
        document.getElementById('confirm-bet-button').style.display = 'none';
        document.getElementById('add-bet').style.display = 'none';
        document.getElementById('subtract-bet').style.display = 'none';
        document.getElementById('clear-bet-button').style.display = 'none';
        selectedBetAmount = 0;
        const betButtons = document.querySelectorAll('.betting-buttons button');
        betButtons.forEach(button => {
            button.classList.remove('highlighted');
        });
        startGame();
    } else {
        alert('Please place a bet first!');
    }
}

// Show blackjack strategy book
function showBlackjackBook() {
    document.getElementById('strategy-image').src = "book.png";
    document.getElementById('blackjack-modal').style.display = "block";
}

// Close the modal
function closeModal() {
    document.getElementById('blackjack-modal').style.display = "none";
}

// Initialize event listeners
setupEventListeners();
