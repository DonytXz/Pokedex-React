import React, { useState, useEffect } from "react";
import { fetchPokemonData, fetchEvolutionChain } from "../services/getPokemon";
import { parseEvolutionChain } from "../helpers/evolutionParser";

const EvolutionNode = ({ node, currentPokemonName, onSelectPokemon }) => {
  if (!node) return null;

  const isCurrent =
    currentPokemonName &&
    node.name.toLowerCase() === currentPokemonName.toLowerCase();

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onSelectPokemon && onSelectPokemon(node.name)}
        aria-label={`View ${node.name} details${isCurrent ? " (currently viewing)" : ""}`}
        aria-current={isCurrent ? "true" : undefined}
        className={`group flex flex-col items-center p-2 rounded-xl transition duration-150 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
          isCurrent
            ? "bg-green-50 border-2 border-green-600 shadow-sm"
            : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
        }`}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative">
          <img
            src={node.sprite}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-150"
            loading="lazy"
          />
        </div>
        <span className="mt-1 text-xs sm:text-sm font-bold capitalize text-gray-900">
          {node.name}
        </span>
        {isCurrent && (
          <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">
            Current
          </span>
        )}
      </button>

      {node.evolvesTo && node.evolvesTo.length > 0 && (
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 mt-3">
          {node.evolvesTo.map((nextStage) => (
            <div
              key={nextStage.name}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              {/* Evolution Arrow & Condition */}
              <div className="flex flex-col items-center px-1">
                <span className="text-gray-400 text-lg sm:text-xl font-bold">
                  →
                </span>
                {nextStage.trigger && (
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-center max-w-[90px] truncate">
                    {nextStage.trigger}
                  </span>
                )}
              </div>

              {/* Recursive Next Stage */}
              <EvolutionNode
                node={nextStage}
                currentPokemonName={currentPokemonName}
                onSelectPokemon={onSelectPokemon}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EvolutionChain = ({ speciesUrl, currentPokemonName, onSelectPokemon }) => {
  const [evolutionTree, setEvolutionTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadChain = async () => {
      if (!speciesUrl) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        // 1. Fetch species to get evolution_chain URL
        const speciesData = await fetchPokemonData(speciesUrl);
        const chainUrl = speciesData?.evolution_chain?.url;

        if (!chainUrl) {
          if (isMounted) {
            setEvolutionTree(null);
            setLoading(false);
          }
          return;
        }

        // 2. Fetch evolution chain
        const chainData = await fetchEvolutionChain(chainUrl);
        if (isMounted && chainData?.chain) {
          const parsed = parseEvolutionChain(chainData.chain);
          setEvolutionTree(parsed);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadChain();

    return () => {
      isMounted = false;
    };
  }, [speciesUrl]);

  if (loading) {
    return (
      <div className="w-full text-center py-6 text-sm text-gray-500" role="status">
        Loading evolution chain...
      </div>
    );
  }

  if (error || !evolutionTree) {
    return (
      <div className="w-full text-center py-4 text-sm text-gray-500">
        Evolution chain unavailable for this Pokémon.
      </div>
    );
  }

  const hasNoEvolutions =
    !evolutionTree.evolvesTo || evolutionTree.evolvesTo.length === 0;

  return (
    <div className="w-full flex flex-col items-center py-2">
      <div className="w-full overflow-x-auto pb-2 flex justify-center">
        <EvolutionNode
          node={evolutionTree}
          currentPokemonName={currentPokemonName}
          onSelectPokemon={onSelectPokemon}
        />
      </div>
      {hasNoEvolutions && (
        <p className="text-xs text-gray-500 italic mt-2">
          This Pokémon does not evolve.
        </p>
      )}
    </div>
  );
};

export default EvolutionChain;
