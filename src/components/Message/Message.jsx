import './Message.css'

export default function Message({ dictionary = { "message": "", "color": 0 } }) {
    let color = dictionary.color
    let message = dictionary.message
    let message_style = "message-push";
    if (color === 0) {
        message_style = "message-push";
    } else if (color === 1) {
       message_style = "message-win";
    } else if (color === -1) {
       message_style = "message-loss";
    }
    return (
        <div className={`message-banner ${!message ? "" : message_style}`}>
            {!message ? <h2>Blackjack</h2> : <h2>{message}</h2>}
        </div>
    )
}