import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MyFavorites.css'

export default function MyFavorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login')
      return
    }
    fetchFavorites()
  }, [token, userId, navigate])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/favorites?userId=${userId}`)
      setFavorites(response.data)
      setError('')
    } catch (err) {
      setError('Error al cargar favoritos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFavorite = async (favoriteId) => {
    if (!window.confirm('¿Eliminar este favorito?')) return

    try {
      await axios.delete(`${backendUrl}/api/favorites/${favoriteId}`)
      setFavorites(favorites.filter(f => f._id !== favoriteId))
      setError('')
    } catch (err) {
      setError('Error al eliminar favorito')
      console.error(err)
    }
  }

  const viewHero = (heroId) => {
    navigate(`/hero/${heroId}`)
  }

  if (!token) {
    return (
      <div className="favorites-page">
        <div className="login-required">
          <p>Debes iniciar sesión para ver tus favoritos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Volver
      </button>

      <div className="favorites-container">
        <h1>Mis Favoritos</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Cargando favoritos...</p>
        ) : favorites.length === 0 ? (
          <div className="no-favorites">
            <p>No tienes favoritos aún</p>
            <button onClick={() => navigate('/')} className="explore-btn">
              Explorar Héroes
            </button>
          </div>
        ) : (
          <div className="favorites-list">
            <p className="count">{favorites.length} favorito{favorites.length !== 1 ? 's' : ''}</p>
            
            <div className="favorites-grid">
              {favorites.map(favorite => (
                <div key={favorite._id} className="favorite-card">
                  <div className="card-header">
                    <h3>{favorite.name}</h3>
                    <span className="category">{favorite.category}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      onClick={() => viewHero(favorite.heroId)}
                      className="view-btn"
                    >
                      Ver Héroe
                    </button>
                    <button
                      onClick={() => handleDeleteFavorite(favorite._id)}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="card-footer">
                    <small>Agregado: {new Date(favorite.createdAt).toLocaleDateString('es-ES')}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
