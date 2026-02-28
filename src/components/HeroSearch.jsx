import { useState, useEffect } from 'react'
import HeroDetails from './HeroDetails'
import './hero.css'

const API_TOKEN = 'dcadb1a7a96dae155e42d2c82c47c6d7'
const API_BASE = `/api/${API_TOKEN}`

export default function HeroSearch() {
  const popularNames = [
    'Batman',
    'Superman',
    'Wonder Woman',
    'Spider-Man',
    'Iron Man',
    'Hulk',
    'Thor',
    'Captain America',
    'Wolverine',
    'Flash',
    'Green Lantern',
    'Aquaman',
    'Cyborg',
    'Black Panther',
    'Doctor Strange',
    'Daredevil',
  ]
  const [popularHeroes, setPopularHeroes] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedHero, setSelectedHero] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function loadPopular() {
      setLoading(true)
      try {
        const promises = popularNames.map(async (name) => {
          try {
            const res = await fetch(`${API_BASE}/search/${encodeURIComponent(name)}`)
            const data = await res.json()
            if (data.response === 'success') return data.results[0]
            return null
          } catch (e) {
            console.log('loadPopular item error', e)
            return null
          }
        })
        const results = await Promise.all(promises)
        console.log('loadPopular results', results)
        const filtered = results.filter(Boolean)
        if (mounted) {
          setPopularHeroes(filtered)
          if (filtered.length === 0) {
            setStatusMessage('No se encontraron héroes populares')
          }
        }
      } catch (err) {
        console.log('loadPopular error', err)
        if (mounted) {
          setStatusMessage('No se encontraron héroes populares')
        }
      } finally {
        setLoading(false)
      }
    }
    loadPopular()
    return () => { mounted = false }
  }, [])

  async function searchHero(e) {
    if (e && e.preventDefault) e.preventDefault()
    if (!query.trim()) {
      setStatusMessage('Ingresa un nombre')
      return
    }
    setStatusMessage('')
    setLoading(true)
    try {
      console.log('searchHero query', query)
      const res = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}`)
      const data = await res.json()
      console.log('searchHero response', data)
      if (data.response === 'success') {
        setSearchResults(data.results)
        if (!data.results.length) {
          setStatusMessage('Héroe no encontrado')
        } else {
          setStatusMessage('')
        }
      } else {
        setSearchResults([])
        setStatusMessage('Héroe no encontrado')
      }
    } catch (err) {
      console.log('searchHero error', err)
      setSearchResults([])
      setStatusMessage('Error en la búsqueda')
    }
    setLoading(false)
  }

  async function openHero(id) {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/${id}`)
      const data = await res.json()
      setSelectedHero(data)
    } catch (err) {
      console.log('openHero failed', err)
      setSelectedHero(null)
    }
    setLoading(false)
  }

  function goHome() {
    setQuery('')
    setSearchResults([])
    setStatusMessage('')
  }

  const list = searchResults.length ? searchResults : popularHeroes

  return (
    <div className="hero-container">
      <button className="home-button" onClick={goHome}>Inicio</button>
      <form className="search-form" onSubmit={searchHero}>
        <input
          className="search-input"
          placeholder="Buscar héroe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" onClick={searchHero} type="submit">
          Buscar
        </button>
      </form>

      {loading && <div className="loader">Cargando...</div>}
      {!loading && statusMessage && (
        <div className="status-message">{statusMessage}</div>
      )}

      <div className="hero-grid">
        {list.map((hero) => (
          <div key={hero.id} className="hero-card" onClick={() => openHero(hero.id)}>
            <img className="hero-image" src={hero.image?.url} alt={hero.name} />
            <div className="hero-name">{hero.name}</div>
          </div>
        ))}
      </div>

      {selectedHero && (
        <HeroDetails hero={selectedHero} onClose={() => setSelectedHero(null)} />
      )}
    </div>
  )
}
