import './App.css'
import HeroSearch from './components/HeroSearch'

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>SuperHero Finder</h1>
        <p className="subtitle">Busca héroes y abre sus detalles</p>
      </header>
      <main>
        <HeroSearch />
      </main>
    </div>
  )
}

export default App
