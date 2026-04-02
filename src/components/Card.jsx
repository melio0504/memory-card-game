export default function Card({ card, onClick, disabled }) {
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const centerOffsetX = (x - 50) / 50
    const centerOffsetY = (y - 50) / 50
    const maxTilt = 14

    const rotateY = centerOffsetX * maxTilt
    const rotateX = centerOffsetY * -maxTilt

    event.currentTarget.style.setProperty('--mx', `${x}%`)
    event.currentTarget.style.setProperty('--my', `${y}%`)
    event.currentTarget.style.setProperty('--rx', `${rotateX}deg`)
    event.currentTarget.style.setProperty('--ry', `${rotateY}deg`)
    event.currentTarget.style.setProperty('--ty', '-8px')
  }

  const resetHover = (event) => {
    event.currentTarget.style.removeProperty('--mx')
    event.currentTarget.style.removeProperty('--my')
    event.currentTarget.style.removeProperty('--rx')
    event.currentTarget.style.removeProperty('--ry')
    event.currentTarget.style.removeProperty('--ty')
  }

  return (
    <button
      type="button"
      className="card"
      onClick={() => onClick(card)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetHover}
      disabled={disabled}
      aria-label={`Choose ${card.imageKey}`}
    >
      <img
        src={card.imageSrc}
        alt={card.alt}
        className="card__image"
        loading="lazy"
        draggable={false}
      />
      <span className="card__shine" aria-hidden="true" />
    </button>
  )
}
