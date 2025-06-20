export default function Message ({dictionary={"message": "", "color": 0}}) {
    let color = dictionary.color
    let message = dictionary.message
    let resultColor = 'black'
    if (color === 0) {
        resultColor = 'black'
    } else if (color === 1) {
        resultColor = 'green'
    } else {
        resultColor = 'red'
    }
    return (
        <h2 style={{ color: resultColor }}>{message}</h2>

    )
}