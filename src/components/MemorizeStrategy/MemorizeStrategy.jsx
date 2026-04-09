import { Link } from 'react-router-dom';
import "./MemorizeStrategy.css";

export default function MemorizeStrategy() {
    return (
        <div className="strategy-page">
            <h1>Blackjack Strategy Basics</h1>
            <h2>Pairs</h2>
            <ul>
                <li><strong>Always Split:</strong> A's and 8's</li>
                <li><strong>Never Split:</strong> 5's and 10's</li>
                <li>Split 2, 3, 7 against dealer 2-7</li>
                <li>Split 4's against 5 and 6</li>
                <li>Split 6's against 2-6</li>
                <li>Split 9's against 2-9 except 7</li>
            </ul>

            <h2>Soft Hands</h2>
            <ul>
                <li><strong>20, 21:</strong> Always Stand</li>
                <li><strong>Soft 19 (A, 8):</strong> Double against 6, otherwise Stand</li>
                <li><strong>Soft 18 (A, 7):</strong>
                    <ul>
                        <li>Double against 2-6 (Stand if can't double)</li>
                        <li>Stand against 7 and 8</li>
                        <li>Hit against 9, 10, A</li>
                    </ul>
                </li>
                <li><strong>Soft 17 (A, 6):</strong> Double against 3-6, otherwise Hit</li>
                <li><strong>Soft 16 (A, 5) & 15 (A, 4):</strong> Double against 4-6, otherwise Hit</li>
                <li><strong>Soft 14 (A, 3) & 13 (A, 2):</strong> Double against 5-6, otherwise Hit</li>
            </ul>

            <h2>Hard Hands</h2>
            <ul>
                <li>Surrender 16 against 9-A</li>
                <li>Surrender 15 against 10</li>
                <li><strong>Always Stand:</strong> 17 and above</li>
                <li>13-16: Stand against 2-6, Hit against 7-A</li>
                <li>12: Stand against 4-6, otherwise Hit</li>
                <li>11: Always Double</li>
                <li>10: Double against 2-9</li>
                <li>9: Double against 3-6</li>
                <li>8 and below: Hit</li>
            </ul>

             <Link to="/blackjack/strategy-trainer" className="strategy-link">
                Train Basic Strategy
            </Link>
        </div>
    );
}