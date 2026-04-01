import React, { useEffect, useState } from 'react'

const API_BASE = 'https://pokeapi.co/api/v2'
const LIMIT = 151

function computeHp(stats) {
  const hpStat = stats.find((s) => s.stat.name === 'hp')?.base_stat ?? 50
  return hpStat * 3
}

function computeDamage(attacker, defender) {
  const atk = attacker.stats.find((s) => s.stat.name === 'attack')?.base_stat ?? 50
  const def = defender.stats.find((s) => s.stat.name === 'defense')?.base_stat ?? 50
  const base = Math.max(5, atk - def / 2)
  const randomFactor = 0.85 + Math.random() * 0.3
  return Math.round(base * randomFactor)
}

export default function Battle() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)
  const [hp1, setHp1] = useState(0)
  const [hp2, setHp2] = useState(0)
  const [turn, setTurn] = useState(1)
  const [log, setLog] = useState([])
  const [finished, setFinished] = useState(false)

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
            return detail
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

  function startBattle() {
    if (!player1 || !player2 || player1.id === player2.id) return
    const maxHp1 = computeHp(player1.stats)
    const maxHp2 = computeHp(player2.stats)
    setHp1(maxHp1)
    setHp2(maxHp2)
    setTurn(1)
    setFinished(false)
    setLog([
      `Le combat commence entre ${player1.name} et ${player2.name} !`,
      `${player1.name} commence.`,
    ])
  }

  function handleAttack() {
    if (!player1 || !player2 || finished) return

    if (turn === 1) {
      const damage = computeDamage(player1, player2)
      const newHp2 = Math.max(0, hp2 - damage)
      setHp2(newHp2)
      setLog((prev) => [...prev, `${player1.name} attaque et inflige ${damage} dégâts !`])

      if (newHp2 === 0) {
        setFinished(true)
        setLog((prev) => [...prev, `${player2.name} est K.O. ! ${player1.name} gagne le combat !`])
      } else {
        setTurn(2)
      }
    } else {
      const damage = computeDamage(player2, player1)
      const newHp1 = Math.max(0, hp1 - damage)
      setHp1(newHp1)
      setLog((prev) => [...prev, `${player2.name} attaque et inflige ${damage} dégâts !`])

      if (newHp1 === 0) {
        setFinished(true)
        setLog((prev) => [...prev, `${player1.name} est K.O. ! ${player2.name} gagne le combat !`])
      } else {
        setTurn(1)
      }
    }
  }

  const isReady = !!player1 && !!player2 && player1.id !== player2.id

  return (
    <section className="battle-page">
      <div className="toolbar">
        <div>
          <h2 className="section-title">Mode combat</h2>
          <p className="section-subtitle">
            Choisissez deux Pokémon de la première génération et faites-les s&apos;affronter.
          </p>
        </div>
      </div>

      {loading && <p className="status-message">Chargement des Pokémon…</p>}
      {error && !loading && <p className="status-message error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="battle-selectors">
            <div className="battle-selector">
              <h3>Dresseur 1</h3>
              <select
                value={player1?.id || ''}
                onChange={(e) =>
                  setPlayer1(pokemons.find((p) => p.id === Number(e.target.value)) || null)
                }
              >
                <option value="">Choisissez un Pokémon</option>
                {pokemons.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{String(p.id).padStart(3, '0')} - {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="battle-selector">
              <h3>Dresseur 2</h3>
              <select
                value={player2?.id || ''}
                onChange={(e) =>
                  setPlayer2(pokemons.find((p) => p.id === Number(e.target.value)) || null)
                }
              >
                <option value="">Choisissez un Pokémon</option>
                {pokemons.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{String(p.id).padStart(3, '0')} - {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="battle-actions">
            <button
              type="button"
              className="back-button"
              disabled={!isReady}
              onClick={startBattle}
            >
              Lancer le combat
            </button>
            <button
              type="button"
              className="back-button"
              disabled={!isReady || finished || hp1 === 0 || hp2 === 0}
              onClick={handleAttack}
            >
              {finished ? 'Combat terminé' : `Attaquer (${turn === 1 ? 'Joueur 1' : 'Joueur 2'})`}
            </button>
          </div>

          {isReady && (
            <div className="battle-arena">
              <div className="battle-side">
                <h3>{player1.name}</h3>
                <div className="battle-sprite-wrapper">
                  <img
                    src={
                      player1.sprites.other?.['official-artwork']?.front_default ||
                      player1.sprites.front_default
                    }
                    alt={player1.name}
                  />
                </div>
                <div className="hp-bar">
                  <div
                    className="hp-bar-fill"
                    style={{
                      width: `${Math.max(
                        5,
                        Math.round((hp1 / computeHp(player1.stats || [])) * 100),
                      )}%`,
                    }}
                  />
                </div>
                <span className="hp-text">
                  PV : {hp1} / {computeHp(player1.stats || [])}
                </span>
              </div>

              <div className="battle-side">
                <h3>{player2.name}</h3>
                <div className="battle-sprite-wrapper">
                  <img
                    src={
                      player2.sprites.other?.['official-artwork']?.front_default ||
                      player2.sprites.front_default
                    }
                    alt={player2.name}
                  />
                </div>
                <div className="hp-bar">
                  <div
                    className="hp-bar-fill hp-bar-enemy"
                    style={{
                      width: `${Math.max(
                        5,
                        Math.round((hp2 / computeHp(player2.stats || [])) * 100),
                      )}%`,
                    }}
                  />
                </div>
                <span className="hp-text">
                  PV : {hp2} / {computeHp(player2.stats || [])}
                </span>
              </div>
            </div>
          )}

          <div className="battle-log">
            <h3>Journal du combat</h3>
            {log.length === 0 && (
              <p className="status-message">Le combat n&apos;a pas encore commencé.</p>
            )}
            {log.length > 0 && (
              <ul>
                {log.map((line, index) => (
                  <li key={`${line}-${index}`}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  )
}

