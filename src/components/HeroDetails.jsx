import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Comments from './Comments'
import './HeroDetails.css'

const API_TOKEN = 'dcadb1a7a96dae155e42d2c82c47c6d7'
const API_BASE = `/api/${API_TOKEN}`

export default function HeroDetails({ hero, onClose }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [heroData, setHeroData] = useState(hero || null)
  const [loading, setLoading] = useState(!hero && !!id)
  const [isFavorite, setIsFavorite] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const userId = localStorage.getItem('userId')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Si es modal, usar hero como prop. Si es ruta, cargar del API
  useEffect(() => {
    if (id && !hero) {
      fetchHero()
    }
  }, [id])

  const fetchHero = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/${id}`)
      const data = await res.json()
      setHeroData(data)
    } catch (err) {
      console.error('Error loading hero:', err)
      setErrorMsg('Error al cargar el héroe')
    } finally {
      setLoading(false)
    }
  }

  // Verificar si es favorito
  useEffect(() => {
    if (heroData && userId) {
      checkIfFavorite()
    }
  }, [heroData, userId])

  const checkIfFavorite = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/favorites?userId=${userId}`)
      if (res.ok) {
        const favorites = await res.json()
        const isFav = favorites.some(fav => String(fav.heroId) === String(heroData.id))
        setIsFavorite(isFav)
      }
    } catch (err) {
      console.error('Error checking favorite:', err)
    }
  }

  const toggleFavorite = async () => {
    if (!userId) {
      setErrorMsg('Debes iniciar sesión para agregar favoritos')
      return
    }

    try {
      if (isFavorite) {
        // Eliminar de favoritos
        const res = await fetch(`${backendUrl}/api/favorites?userId=${userId}`)
        const favorites = await res.json()
        const favToDelete = favorites.find(fav => String(fav.heroId) === String(heroData.id))
        
        if (favToDelete) {
          await fetch(`${backendUrl}/api/favorites/${favToDelete._id}`, {
            method: 'DELETE'
          })
          setIsFavorite(false)
          setSuccessMsg('Eliminado de favoritos')
          setTimeout(() => setSuccessMsg(''), 2000)
        }
      } else {
        // Agregar a favoritos
        const res = await fetch(`${backendUrl}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            heroId: heroData.id,
            name: heroData.name,
            category: 'Favorito'
          })
        })

        if (res.ok) {
          setIsFavorite(true)
          setSuccessMsg('Agregado a favoritos')
          setTimeout(() => setSuccessMsg(''), 2000)
        } else {
          const error = await res.json()
          setErrorMsg(error.error || 'No se pudo agregar a favoritos')
        }
      }
    } catch (err) {
      setErrorMsg('Error al modificar favoritos')
      console.error(err)
    }
  }

  if (!heroData) {
    if (loading) {
      return <div className="loading-container">Cargando...</div>
    }
    if (onClose) {
      return null // Modal mode y no hay hero
    }
    return <div className="loading-container">Héroe no encontrado</div>
  }

  const stats = heroData.powerstats || {}
  const bio = heroData.biography || {}
  const work = heroData.work || {}
  const appearance = heroData.appearance || {}
  const connections = heroData.connections || {}

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

  const content = (
    <>
      <div className="hero-details-header">
        <img src={heroData.image?.url} alt={heroData.name} className="hero-details-image" />
        <div className="hero-details-info">
          <h1>{heroData.name}</h1>
          
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? '★ En Favoritos' : '☆ Agregar a Favoritos'}
          </button>

          {errorMsg && <div className="error-message">{errorMsg}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <div className="stats-section">
            <h3>ESTADÍSTICAS</h3>
            <div className="stats-grid">
              {statOrder.map((key) => (
                <div key={key} className="stat-item">
                  <div className="stat-label">{statLabels[key]}</div>
                  <div className="stat-value">{stats[key] || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <strong>EDITORIAL:</strong> {bio.publisher || '—'}
            </div>
            <div className="info-item">
              <strong>OCUPACIÓN:</strong> {work.occupation || '—'}
            </div>
            <div className="info-item">
              <strong>GÉNERO:</strong> {appearance.gender || '—'}
            </div>
            <div className="info-item">
              <strong>RAZA:</strong> {appearance.race || '—'}
            </div>
            <div className="info-item">
              <strong>ALTURA:</strong> {(appearance.height || ['—'])[0]}
            </div>
            <div className="info-item">
              <strong>PESO:</strong> {(appearance.weight || ['—'])[0]}
            </div>
            <div className="info-item">
              <strong>GRUPO:</strong> {group}
            </div>
            <div className="info-item">
              <strong>FAMILIARES:</strong> {relatives}
            </div>
          </div>
        </div>
      </div>

      {!onClose && <Comments heroId={heroData.id} />}
    </>
  )

  // Si es modal
  if (onClose) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>CERRAR</button>
          <div className="modal-content">
            {content}
          </div>
        </div>
      </div>
    )
  }

  // Si es página completa
  return (
    <div className="hero-details-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Volver
      </button>
      <div className="hero-details-container">
        {content}
      </div>
    </div>
  )
}

