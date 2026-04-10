import './Trainer.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { createShoe } from '../Shoe/Shoe';
import { calculateHandValue } from '../../utils/helpers';
import { getBlackjackStrategy } from '../../utils/book';


const strategy = {
    "Hit": "Hit",
    "Stand": "Stand",
    "Split": "Split",
    "Double Down if allowed, otherwise Hit": "Double",
    "Double Down if allowed, otherwise Stand": "Double",
    "Surrender if allowed, otherwise Hit": "Surrender"
}

const TOTALS = ['hard', 'soft', 'pairs'];

function generateSoftHand(shoe) {
    const ace = { value: 'A', suit: '' };
    const other = { value: Math.floor(Math.random() * (9 - 2 + 1)) + 2, suit: '' };
    return [ace, other];
}

function generateHardHand(shoe) {
    const nonAces = shoe.filter(c => c.value !== 'A');
    const card1 = nonAces[Math.floor(Math.random() * nonAces.length)];
    let card2 = nonAces[Math.floor(Math.random() * nonAces.length)];
    while (card1.value === card2.value || calculateHandValue([card1, card2]) >= 20) {
        card2 = nonAces[Math.floor(Math.random() * nonAces.length)];
    }
    return [card1, card2];
}

function generatePairHand(shoe) {
    const card1 = shoe[Math.floor(Math.random() * shoe.length)];
    return [card1, card1];
}

function generateScenario(selectedTotals) {
    const shoe = createShoe(1);
    const dealerCard = shoe.pop();
    const type = selectedTotals[Math.floor(Math.random() * selectedTotals.length)];
    const playerCards =
        type === 'soft' ? generateSoftHand(shoe) :
            type === 'pairs' ? generatePairHand(shoe) :
                generateHardHand(shoe);
    return {
        dealer: dealerCard,
        player: playerCards
    };
}


export default function Trainer() {
    const [started, setStarted] = useState(false);
    const [scenario, setScenario] = useState(generateScenario(TOTALS));
    const [feedback, setFeedback] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedTotals, setSelectedTotals] = useState([...TOTALS]);
    const dealerCard = scenario.dealer
    const playerCards = scenario.player

    const start = () => {
        setScenario(generateScenario(selectedTotals));
        setStarted(true);
    };

    const reset = () => {
        setScore(0);
        setTotal(0);
        setScenario(generateScenario(selectedTotals));
    };

    const toggleTotal = (total) => {
        setSelectedTotals(prev => {
            // Prevent deselecting the last one
            if (prev.includes(total) && prev.length === 1) return prev;
            return prev.includes(total)
                ? prev.filter(t => t !== total)
                : [...prev, total];
        });
    };

    const checkAnswer = (action) => {
        const correctAction = strategy[getBlackjackStrategy(dealerCard, playerCards)];
        const isCorrect = action === correctAction;
        setFeedback({
            correct: isCorrect,
            correctAnswer: correctAction
        });
        setTotal(prev => prev + 1);
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setHasAnswered(true);
    };

    return (
        <div className="trainer-container">
            <h1>Blackjack Trainer</h1>

            <h3>Select which totals to practice:</h3>
            <div className="totals-selector">
                {TOTALS.map(t => (
                    <button
                        key={t}
                        onClick={() => toggleTotal(t)}
                        className={`total-toggle ${selectedTotals.includes(t) ? 'active' : ''}`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {!started ? (
                <button className="option-button" onClick={start}>
                    Start
                </button>
            ) : (
                <>
                    <div>
                        <h3>Dealer: {dealerCard.value}</h3>
                        <h3>Player: {playerCards.map(c => c.value).join(", ")} ({calculateHandValue(playerCards)})</h3>
                    </div>

                    <div>
                        {["Hit", "Stand", "Double", "Split", "Surrender"].map(a => (
                            <button
                                key={a}
                                onClick={() => checkAnswer(a)}
                                disabled={hasAnswered}
                                className="option-button"
                            >
                                {a}
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                            {feedback.correct ? "✅ Correct!" : `❌ Incorrect: ${feedback.correctAnswer}`}
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setScenario(generateScenario(selectedTotals));
                            setFeedback(null);
                            setHasAnswered(false);
                        }}
                        disabled={!hasAnswered}
                        className="next-button"
                    >
                        Next
                    </button>

                    <div className='scoreboard-container'>
                        <div className="scoreboard">
                            Score: {score} / {total} ({total > 0 ? Math.round((score / total) * 100) : 0}%)
                        </div>
                        <div>
                            <button className="reset-button" onClick={reset}>Reset</button>
                        </div>
                    </div>
                </>
            )}

            {/* <div className="streak">
            🔥 Streak: {streak}
        </div> */}
            <div className='links'>
                <Link to="/memorize-strategy" className="back-link">
                    ← Back to Strategy
                </Link>
                <Link to="/" target="_blank" className="strategy-link">
                    Play Blackjack →
                </Link>
            </div>
        </div>
    );
}