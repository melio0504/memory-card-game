import Card from './Card'

export default function GameBoard({ cards, onCardClick, disabled }) {
  return (
    <section className="game-board" aria-label="Cat card grid">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} disabled={disabled} />
      ))}
    </section>
  )
}
