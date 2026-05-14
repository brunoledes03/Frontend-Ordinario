import { useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          SuperHero Finder
        </div>

        <div className="navbar-menu">
          {token && username ? (
            <div className="user-section">
              <span className="welcome-text">Bienvenido, <strong>{username}</strong></span>
              <button 
                onClick={() => navigate('/favorites')} 
                className="favorites-btn"
                title="Ver mis favoritos"
              >
                Mis Favoritos
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="login-btn">
              Inicia Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
