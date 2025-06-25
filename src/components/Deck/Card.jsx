import './Card.css'

export default function Card({ value, suit, hidden }) {
  // return (
  //   <span className={!hidden && (suit === '♢' || suit === '♡') ? "card red" : "card"}>
  //     {hidden ? '[Face Down]' : `${value}${suit}`}
  //   </span>
  // );
  const suitColors = {
    '♡': 'red',
    '♢': 'red',
    '♧': 'black',
    '♤': 'black',
  };
  const color = suitColors[suit.toLowerCase()];
  // return (
  //   <div className="card">
  //     <div className={`corner top-left ${color}`}>
  //       {value}<br />{suit}
  //     </div>
  //     <div className={`corner bottom-right ${color}`}>
  //       {value}<br />{suit}
  //     </div>
  //     <div className={`suit ${color}`}>
  //       {suit}
  //     </div>
  //   </div>
  // );
  return (
    <div className={`card-wrapper ${hidden ? 'flipped' : ''}`}>
      <div className="card-inner">
        {!hidden ? (
        <div className="card card-front">
          <div className={`corner top-left ${color}`}>
            {value}<br />{suit}
          </div>
          <div className={`corner bottom-right ${color}`}>
            {value}<br />{suit}
          </div>
          <div className={`suit ${color}`}>
            {suit}
          </div>
        </div>
        ) : (
          <div className="card card-front" />
        )}
        <div className="card card-back">
          {/* Simple patterned back */}
          <div className="back-pattern">🂠</div>
        </div>
      </div>
    </div>
  );
}