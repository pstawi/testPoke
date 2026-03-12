import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import PokemonList from './pages/PokemonList.jsx'
import PokemonDetail from './pages/PokemonDetail.jsx'

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="brand-badge">Pokédex</span>
          <div className="brand-text">
            <h1>PokéExplorer</h1>
            <p>Découvrez les Pokémon avec la PokéAPI</p>
          </div>
        </Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>
          Données fournies par{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
            PokéAPI
          </a>
        </span>
      </footer>
    </div>
  )
}

