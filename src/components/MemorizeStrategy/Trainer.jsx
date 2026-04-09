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
    "Double Down if allowed, otherwise Stand": "Double"
}


function generateScenario() {
    const shoe = createShoe(1);
    const dealerCard = shoe.pop();
    let playerCards = [shoe.pop(), shoe.pop()];
    while (calculateHandValue(playerCards) === 21) {
        playerCards = [shoe.pop(), shoe.pop()];
    }
    return {
        dealer: dealerCard,
        player: playerCards
    };
}


export default function Trainer() {
    const [scenario, setScenario] = useState(generateScenario());
    const [feedback, setFeedback] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const dealerCard = scenario.dealer
    const playerCards = scenario.player

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

            <div className="">
                <h3>Dealer: {dealerCard.value}</h3>
                <h3>Player: {playerCards.map(c => c.value).join(", ")} ({calculateHandValue(playerCards)})</h3>
            </div>

            <div>
                {["Hit", "Stand", "Double", "Split"].map(a => (
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
                    setScenario(generateScenario());
                    setFeedback(null);
                    setHasAnswered(false);
                }}
                disabled={!hasAnswered}
                className="next-button"
            >
                Next
            </button>

            <div className="scoreboard">
                Score: {score} / {total} ({total > 0 ? Math.round((score / total) * 100) : 0}%)
            </div>

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