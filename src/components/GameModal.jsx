export default function GameModal({
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  gifSrc,
  gifAlt,
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <h2 className="modal__title">{title}</h2>
        {gifSrc ? (
          <img src={gifSrc} alt={gifAlt || ''} className="modal__gif" draggable={false} />
        ) : null}
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button type="button" className="button" onClick={onPrimary}>
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary ? (
            <button
              type="button"
              className="button button--ghost"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  )
}
