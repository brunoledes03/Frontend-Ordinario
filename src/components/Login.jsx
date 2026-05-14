import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' o 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login'
        ? `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
        : `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`

      const payload = mode === 'login'
        ? { username: formData.username, password: formData.password }
        : formData

      const response = await axios.post(endpoint, payload)
      
      // Guardar token y usuario
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)
      localStorage.setItem('userId', response.data.userId)

      // Redirigir a heroSearch
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al procesar solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nombre de usuario"
              required
              minLength="3"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
              minLength="6"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirmar Contraseña:</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                minLength="6"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Cargando...' : (mode === 'login' ? 'Ingresar' : 'Registrarse')}
          </button>
        </form>

        <div className="toggle-mode">
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta? 
              <button onClick={() => { setMode('register'); setError(''); }}>
                Crear una
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?
              <button onClick={() => { setMode('login'); setError(''); }}>
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
