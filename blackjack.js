// document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('double-button').addEventListener('click', doubleDown);
document.getElementById('confirm-bet-button').addEventListener('click', confirmBet); // Added Confirm Bet Button

let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerBet = 0;
let showDealerScore = false;
let playerTotalScore = 0;  // To keep track of total score
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['♤', '♢', '♡', '♧'];
let deck = [];

// Function to start the game
function startGame() {
    gameOver = false;
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    showDealerScore = false;

    document.getElementById('dealer-score').style.display = 'none';  // Hide dealer's score initially
    document.getElementById('status').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').textContent = '';
    document.getElementById('dealer-score').textContent = '';
    document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`
    
    // Deal cards to player and dealer with delay
    deck = createDeck();
    shuffleDeck(deck);
    dealCards();
}

// Create and shuffle the deck
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

// Deal cards to player and dealer with one-second delay
async function dealCards() {
    // Deal two cards to player and dealer
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    // Show the cards (hide dealer's second card initially)
    // document.getElementById('player-cards').innerHTML = formatCards(playerHand);
    await formatCards(playerHand, 'player-cards')
    hidden = { value: 'Hidden', suit: ''};
    await formatCards([dealerHand[0], hidden], 'dealer-cards')
    // document.getElementById('dealer-cards').innerHTML = formatCards([dealerHand[0], hidden]);
    updateScores();

    // Enable all game buttons after starting the game
    disableButtons(false)

    // Show the game phase buttons
    document.querySelector('.game-buttons').style.display = 'block';
}


// Format the cards for HTML rendering
// function formatCards(hand) {
//     return hand.map(card => {
//         return `<div class="card">${card.value} ${card.suit}</div>`;
//     }).join('');  // Join the card elements as HTML string
// }
async function formatCards(hand, id, ms=1000) {
    let formattedCards = '';

    // Loop through each card in the hand
    for (let i = 0; i < hand.length; i++) {
        await sleep(ms);
        formattedCards += `<div class="card">${hand[i].value} ${hand[i].suit}</div>`;
        document.getElementById(id).innerHTML = formattedCards;
    }

    return formattedCards;
}

// Update scores after each action
function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    // document.getElementById('player-score').textContent = `Your Hand: ${playerScore}`;
    document.getElementById('player-score').textContent = playerScore;

    if (showDealerScore) {
        document.getElementById('dealer-score').style.display = 'block';  // Show dealer's score
        // document.getElementById('dealer-score').textContent = `Dealer Score: ${dealerScore}`;
        document.getElementById('dealer-score').textContent = dealerScore;
    }
}

// Calculate the score of a hand
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        const value = card.value;
        if (value === 'J' || value === 'Q' || value === 'K') {
            score += 10;
        } else if (value === 'A') {
            aces++;
            score += 11;
        } else {
            score += parseInt(value);
        }
    });

    // Adjust for Aces if score is over 21
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Hit: Player draws a new card
async function hit() {
    if (!gameOver) {
        playerHand.push(deck.pop());
        await formatCards(playerHand, 'player-cards', 0);
        // document.getElementById('player-cards').innerHTML += `<div class="card">${playerHand[playerHand.length - 1].value} ${playerHand[playerHand.length - 1].suit}</div>`;
        updateScores();

        // Check for bust
        if (playerScore > 21) {
            gameOver = true;
            document.getElementById('status').textContent = "Player Bust! You lose.";
            document.getElementById('status').style.color = 'red'
            playerTotalScore -= playerBet; // Player loses, subtract bet from total score
            document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`
            // updateScores();
            disableButtons(true);
            // Show the bet buttons after a game ends with delay
            displayBetButtons();
        }
    }
}

// Sleep function to add a delay (used for dealer's turn)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Stand: Player ends their turn, dealer plays
async function stand() {
    disableButtons(true)
    await sleep(1000);
    showDealerScore = true;
    updateScores();

    if (!gameOver) {
        // Reveal dealer's second card
        // document.getElementById('dealer-cards').innerHTML = formatCards(dealerHand);
        await formatCards(dealerHand, 'dealer-cards', 0);
        

        // Dealer's turn: Draw cards until dealer has 17 or more
        while (dealerScore < 17) {
            await sleep(1000);  // Wait for 1 second before dealer draws a card
            dealerHand.push(deck.pop());
            // document.getElementById('dealer-cards').innerHTML += `<div class="card">${dealerHand[dealerHand.length - 1].value} ${dealerHand[dealerHand.length - 1].suit}</div>`;
            // document.getElementById('dealer-cards').innerHTML = formatCards(dealerHand);
            await formatCards(dealerHand, 'dealer-cards', 0);
            updateScores();
        }
        gameOver = true;
        // Determine winner
        if (dealerScore > 21) {
            document.getElementById('status').textContent = "Dealer Bust! You win.";
            document.getElementById('status').style.color = 'green'
            playerTotalScore += playerBet; // Player wins, add bet to total score
        } else if (playerScore > dealerScore) {
            document.getElementById('status').textContent = "You win!";
            document.getElementById('status').style.color = 'green'
            playerTotalScore += playerBet; // Player wins, add bet to total score
        } else if (playerScore < dealerScore) {
            document.getElementById('status').textContent = "You lose.";
            document.getElementById('status').style.color = 'red'
            playerTotalScore -= playerBet; // Player loses, subtract bet from total score
        } else {
            document.getElementById('status').textContent = "It's a tie!";
        }
        document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`
        playerBet = 0
        updateCurrentBetDisplay()

        updateScores();
        disableButtons(true);  // Disable buttons after game ends

        // Show the bet buttons after a game ends with delay
        displayBetButtons();
    }
}

// Double Down: Player doubles the bet and stands
async function doubleDown() {
    if (!gameOver) {
        playerHand.push(deck.pop());
        playerBet *= 2;
        updateCurrentBetDisplay();
        // document.getElementById('player-cards').innerHTML = formatCards(playerHand);
        await formatCards(playerHand, 'player-cards', 0);
        updateScores();
        if (playerScore > 21) {
            gameOver = true;
            document.getElementById('status').textContent = "Player Bust! You lose.";
            document.getElementById('status').style.color = 'red'
            playerTotalScore -= playerBet; // Player loses, subtract bet from total score
            document.getElementById('total-winnings').textContent = `Total winnings: $${playerTotalScore}`
            // playerBet = 0
            // updateCurrentBetDisplay()
            disableButtons(true);
            // Show the bet buttons after a game ends with delay
            displayBetButtons();
        } else {
            stand();  // Automatically stand after doubling down
        }
    }
}


// Disable all game buttons after game ends
function disableButtons(value) {
    document.getElementById('hit-button').disabled = value;
    document.getElementById('stand-button').disabled = value;
    document.getElementById('double-button').disabled = value;
}

// Show the betting buttons after a game ends
function displayBetButtons() {
    document.querySelector('.betting-buttons').style.display = 'block';
    document.getElementById('confirm-bet-button').style.display = 'inline';
    document.querySelector('.game-buttons').style.display = 'none';  // Hide game buttons
}

// Bet selection: Update the player's bet based on button clicked
const betButtons = document.querySelectorAll('.betting-buttons button');
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        playerBet = parseInt(button.textContent.split(' ')[1]);
        updateCurrentBetDisplay();  // Update the current bet display
        console.log(`Bet placed: ${playerBet}`);
    });
});

// Confirm Bet: Hide betting buttons and show game buttons
function confirmBet() {
    if (playerBet > 0) {
        // Hide the betting phase (betting buttons and confirm bet button)
        document.querySelector('.betting-buttons').style.display = 'none';
        document.getElementById('confirm-bet-button').style.display = 'none';
        console.log(`Bet confirmed: ${playerBet}`);
        startGame();
    } else {
        alert('Please place a bet first!');
    }
}

// Update the current bet display below player's cards
function updateCurrentBetDisplay() {
    document.getElementById('current-bet').textContent = `Current Bet: $${playerBet}`;
}

// Function to open the strategy modal and display an image
function showBlackjackBook() {
    const strategyImageUrl = "book.png"; // Replace with the path to your image file
    document.getElementById('strategy-image').src = strategyImageUrl; // Set the image source
    document.getElementById('blackjack-modal').style.display = "block"; // Show the modal
}

// Close the modal when the user clicks the close button
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('blackjack-modal').style.display = "none"; // Close the modal
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('blackjack-modal')) {
        document.getElementById('blackjack-modal').style.display = "none"; // Close modal
    }
});

document.getElementById('open-strategy-button').addEventListener('click', showBlackjackBook);

