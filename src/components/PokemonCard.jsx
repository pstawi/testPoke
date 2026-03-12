import React from 'react'
import { Link } from 'react-router-dom'

export default function PokemonCard({ pokemon }) {
  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
      <div className="pokemon-card-inner">
        <div className="pokemon-image-wrapper">
          {pokemon.image && (
            <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" loading="lazy" />
          )}
        </div>
        <div className="pokemon-card-content">
          <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <div className="pokemon-types">
            {pokemon.types?.map((type) => (
              <span key={type} className={`type-badge type-${type}`}>
                {type}
              </span>
            ))}
          </div>
          {pokemon.baseExperience != null && (
            <p className="pokemon-meta">Exp. de base : {pokemon.baseExperience}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

