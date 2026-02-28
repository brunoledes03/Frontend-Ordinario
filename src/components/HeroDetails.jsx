export default function HeroDetails({ hero, onClose }) {
  if (!hero) return null

  const stats = hero.powerstats || {}
  const bio = hero.biography || {}
  const work = hero.work || {}
  const appearance = hero.appearance || {}
  const connections = hero.connections || {}

  const statOrder = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat']
  const statLabels = {
    intelligence: 'INTELIGENCIA',
    strength: 'FUERZA',
    speed: 'VELOCIDAD',
    durability: 'DURABILIDAD',
    power: 'PODER',
    combat: 'COMBATE'
  }

  const group = connections.groupAffiliation || connections['group-affiliation'] || '—'
  const relatives = connections.relatives || '—'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>CERRAR</button>
        <div className="modal-content">
          <div className="modal-left">
            <img src={hero.image?.url} alt={hero.name} className="modal-image" />
          </div>
          <div className="modal-right">
            <h2 className="modal-title">{hero.name}</h2>

            <div className="modal-section">
              <h3>ESTADÍSTICAS</h3>
              <ul>
                {statOrder.map((key) => (
                  <li key={key}>{statLabels[key]}: {stats[key] || '—'}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <p><strong>EDITORIAL:</strong> {bio.publisher || '—'}</p>
              <p><strong>OCUPACIÓN:</strong> {work.occupation || '—'}</p>
            </div>

            <div className="modal-section">
              <h3>APARIENCIA</h3>
              <p><strong>GÉNERO:</strong> {appearance.gender || '—'}</p>
              <p><strong>RAZA:</strong> {appearance.race || '—'}</p>
              <p><strong>ALTURA:</strong> {(appearance.height || ['—'])[0]}</p>
              <p><strong>PESO:</strong> {(appearance.weight || ['—'])[0]}</p>
            </div>

            <div className="modal-section">
              <h3>CONEXIONES</h3>
              <p><strong>GRUPO:</strong> {group}</p>
              <p><strong>FAMILIARES:</strong> {relatives}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
