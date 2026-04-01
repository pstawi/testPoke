import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import PokemonList from './pages/PokemonList.jsx'
import PokemonDetail from './pages/PokemonDetail.jsx'
import Battle from './pages/Battle.jsx'

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-badge">Pokédex</span>
            <div className="brand-text">
              <h1>PokéExplorer</h1>
              <p>Découvrez les Pokémon avec la PokéAPI</p>
            </div>
          </Link>
          <nav className="main-nav">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
              end
            >
              Liste
            </NavLink>
            <NavLink
              to="/battle"
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              Combat
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
          <Route path="/battle" element={<Battle />} />
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

