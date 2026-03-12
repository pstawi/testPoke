import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const API_BASE = 'https://pokeapi.co/api/v2'

function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

export default function PokemonDetail() {
  const { name } = useParams()
  const navigate = useNavigate()

  const [pokemon, setPokemon] = useState(null)
  const [evolutionChain, setEvolutionChain] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE}/pokemon/${name}`)
        if (!res.ok) throw new Error("Impossible de charger ce Pokémon.")
        const data = await res.json()

        const speciesRes = await fetch(data.species.url)
        if (!speciesRes.ok) throw new Error("Impossible de charger l'espèce.")
        const species = await speciesRes.json()

        const evoRes = await fetch(species.evolution_chain.url)
        if (!evoRes.ok) throw new Error("Impossible de charger la chaîne d'évolution.")
        const evoData = await evoRes.json()

        const chain = []
        let node = evoData.chain
        while (node) {
          const id = extractIdFromUrl(node.species.url)
          chain.push({
            name: node.species.name,
            id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          })
          if (node.evolves_to && node.evolves_to.length > 0) {
            node = node.evolves_to[0]
          } else {
            node = null
          }
        }

        setPokemon({
          id: data.id,
          name: data.name,
          image:
            data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          baseExperience: data.base_experience,
          types: data.types.map((t) => t.type.name),
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
        })
        setEvolutionChain(chain)
      } catch (e) {
        setError(e.message || 'Une erreur est survenue.')
      } finally {
        setLoading(false)
      }
    }

    if (name) {
      fetchDetail()
    }
  }, [name])

  if (loading) {
    return <p className="status-message">Chargement du Pokémon…</p>
  }

  if (error) {
    return (
      <div>
        <p className="status-message error">{error}</p>
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          ← Retour
        </button>
      </div>
    )
  }

  if (!pokemon) return null

  return (
    <section className="pokemon-detail">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← Retour à la liste
      </button>

      <div className="detail-header">
        <div className="detail-main">
          <div className="detail-image-wrapper">
            {pokemon.image && (
              <img src={pokemon.image} alt={pokemon.name} className="detail-image" />
            )}
          </div>
          <div className="detail-info">
            <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
            <h2 className="pokemon-name">{pokemon.name}</h2>
            <div className="pokemon-types">
              {pokemon.types.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="detail-meta-grid">
              <div>
                <span className="meta-label">Taille</span>
                <span className="meta-value">{pokemon.height / 10} m</span>
              </div>
              <div>
                <span className="meta-label">Poids</span>
                <span className="meta-value">{pokemon.weight / 10} kg</span>
              </div>
              <div>
                <span className="meta-label">Exp. de base</span>
                <span className="meta-value">{pokemon.baseExperience}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-stats">
          <h3>Statistiques</h3>
          <ul>
            {pokemon.stats.map((stat) => (
              <li key={stat.name}>
                <span className="stat-name">{stat.name}</span>
                <div className="stat-bar">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${Math.min(stat.value, 150)}px` }}
                  />
                </div>
                <span className="stat-value">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="detail-evolution">
        <h3>Chaîne d&apos;évolution</h3>
        {evolutionChain.length === 0 && (
          <p className="status-message">Aucune évolution disponible pour ce Pokémon.</p>
        )}
        {evolutionChain.length > 0 && (
          <div className="evolution-chain">
            {evolutionChain.map((step, index) => (
              <div key={step.id} className="evolution-step">
                <Link to={`/pokemon/${step.name}`} className="evolution-card">
                  <img
                    src={step.image}
                    alt={step.name}
                    className="evolution-image"
                    loading="lazy"
                  />
                  <span className="evolution-name">{step.name}</span>
                  <span className="pokemon-id">#{String(step.id).padStart(3, '0')}</span>
                </Link>
                {index < evolutionChain.length - 1 && <span className="evolution-arrow">→</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

