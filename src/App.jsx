import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HeroSearch from './components/HeroSearch'
import HeroDetails from './components/HeroDetails'
import Login from './components/Login'
import MyFavorites from './components/MyFavorites'

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSearchPage />} />
        <Route path="/hero/:id" element={<HeroDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<MyFavorites />} />
      </Routes>
    </div>
  )
}

function HeroSearchPage() {
  return (
    <>
      <header className="app-header">
        <h1>SuperHero Finder</h1>
        <p className="subtitle">Busca héroes y abre sus detalles</p>
      </header>
      <main>
        <HeroSearch />
      </main>
    </>
  )
}

export default App
