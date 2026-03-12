import React, { useEffect, useState } from 'react'
import PokemonCard from '../components/PokemonCard.jsx'

const API_BASE = 'https://pokeapi.co/api/v2'
const LIMIT = 151

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchPokemons() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE}/pokemon?limit=${LIMIT}&offset=0`)
        if (!res.ok) throw new Error('Erreur lors du chargement des Pokémon')
        const data = await res.json()

        const detailed = await Promise.all(
          data.results.map(async (item) => {
            const detailRes = await fetch(item.url)
            if (!detailRes.ok) return null
            const detail = await detailRes.json()
            return {
              id: detail.id,
              name: detail.name,
              image: detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default,
              types: detail.types.map((t) => t.type.name),
              baseExperience: detail.base_experience,
            }
          }),
        )

        setPokemons(detailed.filter(Boolean))
      } catch (e) {
        setError(e.message || 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchPokemons()
  }, [])

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <section>
      <div className="toolbar">
        <div>
          <h2 className="section-title">Pokémon (1ère génération)</h2>
          <p className="section-subtitle">
            Cliquez sur une carte pour voir les détails, statistiques et évolutions.
          </p>
        </div>
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Rechercher un Pokémon…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="status-message">Chargement des Pokémon…</p>}
      {error && !loading && <p className="status-message error">{error}</p>}

      {!loading && !error && (
        <div className="pokemon-grid">
          {filtered.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
          {filtered.length === 0 && (
            <p className="status-message">Aucun Pokémon ne correspond à votre recherche.</p>
          )}
        </div>
      )}
    </section>
  )
}

