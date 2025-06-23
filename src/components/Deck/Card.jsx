import './Card.css'

export default function Card({ value, suit, hidden }) {
  return (
    <span className="card">
      {hidden ? '[Face Down]' : `${value}${suit}`}
    </span>
  );
}