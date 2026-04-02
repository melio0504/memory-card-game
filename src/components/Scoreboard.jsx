import { TARGET_STREAK } from '../utils/gameLogic'

export default function Scoreboard({ streak, best }) {
  return (
    <header className="scoreboard" aria-label="Game score">
      <h1 className="scoreboard__title">Do not click the same cat twice okieeeeee?</h1>
      <p className="scoreboard__line">
        Current Score: <strong>{streak}</strong> | High Score: <strong>{best}</strong>
      </p>
      <p className="scoreboard__goal">Win condition: {TARGET_STREAK} unique clicks in a row.</p>
    </header>
  )
}
