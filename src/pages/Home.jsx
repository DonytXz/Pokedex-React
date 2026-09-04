import React, { useState, useEffect, useRef, useCallback } from "react";
import Grid from "../components/Grid";
import Logo from "../components/Logo";
import Search from "../components/Search";
import {
  fetchPokemon,
  fetchAllPokemonNames,
  fetchPokemonData,
  fetchTypePokemons,
} from "../services/getPokemon";
import Modal from "../components/Modal";
import Butons from "../components/Butons";
import Filters, { GENERATIONS } from "../components/Filters";
import TeamBuilder from "../components/TeamBuilder";
import PokePattern from "../assets/img/pokepattern.jpg";

const getStoredItem = (key, fallback = []) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    }
  } catch {
    return fallback;
  }
  return fallback;
};

const setStoredItem = (key, data) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {}
};

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [sharedPageVal, setSharedPageVal] = useState();
  const [closeModal, setCloseModal] = useState(true);
  const [pokemonModalVal, setPokemonModalVal] = useState();
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isList, setIslist] = useState(true);
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagePokemons, setPagePokemons] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  // Filters state
  const [selectedGen, setSelectedGen] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);

  // Favorites & Team state
  const [favorites, setFavorites] = useState(() => getStoredItem("pokedex:favorites", []));
  const [team, setTeam] = useState(() => getStoredItem("pokedex:team", []));
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const abortControllerRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const pendingTargetRef = useRef(null);

  useEffect(() => {
    const loadAllPokemon = async () => {
      const data = await fetchAllPokemonNames();
      if (data && data.results) {
        setAllPokemonList(data.results);
      }
    };
    loadAllPokemon();
  }, []);

  const isFav = useCallback(
    (p) => {
      if (!p) return false;
      return favorites.some((fav) =>
        typeof fav === "string"
          ? fav.toLowerCase() === p.name?.toLowerCase()
          : fav?.id === p.id || fav?.name === p.name
      );
    },
    [favorites]
  );

  const inTeam = useCallback(
    (p) => {
      if (!p) return false;
      return team.some((t) => t?.id === p.id || t?.name === p.name);
    },
    [team]
  );

  const handleToggleFavorite = useCallback((p) => {
    if (!p) return;
    setFavorites((prev) => {
      const exists = prev.some((f) =>
        typeof f === "string"
          ? f.toLowerCase() === p.name?.toLowerCase()
          : f.id === p.id || f.name === p.name
      );
      const next = exists
        ? prev.filter((f) =>
            typeof f === "string"
              ? f.toLowerCase() !== p.name?.toLowerCase()
              : f.id !== p.id && f.name !== p.name
          )
        : [
            ...prev,
            {
              id: p.id,
              name: p.name,
              sprites: p.sprites,
              types: p.types,
              stats: p.stats,
            },
          ];
      setStoredItem("pokedex:favorites", next);
      return next;
    });
  }, []);

  const handleToggleTeam = useCallback((p) => {
    if (!p) return;
    setTeam((prev) => {
      const exists = prev.some((t) => t.id === p.id || t.name === p.name);
      if (exists) {
        const next = prev.filter((t) => t.id !== p.id && t.name !== p.name);
        setStoredItem("pokedex:team", next);
        return next;
      }

      if (prev.length >= 6) {
        alert("Battle team is full! Maximum 6 Pokémon allowed.");
        return prev;
      }

      const next = [
        ...prev,
        {
          id: p.id,
          name: p.name,
          sprites: p.sprites,
          types: p.types,
          stats: p.stats,
        },
      ];
      setStoredItem("pokedex:team", next);
      return next;
    });
  }, []);

  const executeFilter = useCallback(
    async (query, gen, type, favsOnly) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const isFilterActive =
        (query && query.length > 0) ||
        gen !== "all" ||
        type !== "all" ||
        favsOnly;

      if (!isFilterActive) {
        setSearched(false);
        setPokemon([]);
        setSearchLoading(false);
        setSearchStatus("");
        return;
      }

      setSearched(true);
      setSearchLoading(true);
      setSearchStatus("Searching Pokémon...");

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        // 1. Initial Candidate List
        let candidates = allPokemonList;

        if (favsOnly) {
          candidates = favorites.map((f) => {
            if (typeof f === "string") {
              const matched = allPokemonList.find((p) => p.name === f);
              return matched || { name: f, url: "" };
            }
            return {
              name: f.name,
              url: `https://pokeapi.co/api/v2/pokemon/${f.id}/`,
            };
          });
        }

        // 2. Filter by Generation Range
        if (gen !== "all") {
          const genConfig = GENERATIONS.find((g) => g.id === gen);
          if (genConfig) {
            const [start, end] = genConfig.range;
            candidates = candidates.filter((p) => {
              const idMatch = p.url?.match(/\/pokemon(?:-species)?\/(\d+)\//);
              if (!idMatch) return false;
              const id = parseInt(idMatch[1], 10);
              return id >= start && id <= end;
            });
          }
        }

        // 3. Filter by Elemental Type
        if (type !== "all") {
          const typePokemons = await fetchTypePokemons(type);
          const typeNameSet = new Set(typePokemons.map((tp) => tp.name));
          candidates = candidates.filter((p) => typeNameSet.has(p.name));
        }

        // 4. Filter by Search Query
        if (query && query.length > 0) {
          candidates = candidates.filter((p) => {
            const idMatch = p.url?.match(/\/pokemon(?:-species)?\/(\d+)\//);
            const id = idMatch ? idMatch[1] : null;
            return p.name.includes(query) || (id && id.includes(query));
          });
        }

        const limitedMatches = candidates.slice(0, 18);
        const promises = limitedMatches.map((p) => {
          if (p.url && p.url.startsWith("http")) {
            return fetchPokemonData(p.url, signal);
          }
          return fetchPokemon(p.name);
        });

        const results = await Promise.all(promises);
        const filtered = results.filter(Boolean);

        setPokemon(filtered);
        setSearchStatus(
          filtered.length > 0
            ? `Found ${filtered.length} Pokémon matching search.`
            : "No Pokémon found matching search."
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setPokemon([]);
          setSearchStatus("Error searching Pokémon.");
        }
      } finally {
        if (!signal.aborted) {
          setSearchLoading(false);
        }
      }
    },
    [allPokemonList, favorites]
  );

  const searchPokemon = (query) => {
    setSearchQuery(query);
    executeFilter(query, selectedGen, selectedType, isFavoritesOnly);
  };

  const handleSelectGen = (gen) => {
    setSelectedGen(gen);
    executeFilter(searchQuery, gen, selectedType, isFavoritesOnly);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    executeFilter(searchQuery, selectedGen, type, isFavoritesOnly);
  };

  const handleToggleFavoritesFilter = () => {
    const next = !isFavoritesOnly;
    setIsFavoritesOnly(next);
    executeFilter(searchQuery, selectedGen, selectedType, next);
  };

  const handleResetFilters = () => {
    setSelectedGen("all");
    setSelectedType("all");
    setIsFavoritesOnly(false);
    executeFilter(searchQuery, "all", "all", false);
  };

  const loadPokemonDetails = async (query) => {
    if (!query) return;
    setPokemonDetails(null);
    const data = await fetchPokemon(query);
    setPokemonDetails(data || null);
  };

  const handleOpenModal = useCallback((val) => {
    lastActiveElementRef.current = document.activeElement;
    setPokemonModalVal(val);
    setCloseModal(false);
  }, []);

  const handleCloseModal = useCallback((isClosed) => {
    setCloseModal(isClosed);
    pendingTargetRef.current = null;
    if (isClosed && lastActiveElementRef.current) {
      setTimeout(() => {
        lastActiveElementRef.current?.focus();
      }, 50);
    }
  }, []);

  const handlePokemonsLoaded = useCallback(
    (pokemonsList, totalCount) => {
      setPagePokemons(pokemonsList);
      setTotalPages(totalCount);
      if (pendingTargetRef.current && pokemonsList && pokemonsList.length > 0) {
        const target = pendingTargetRef.current;
        pendingTargetRef.current = null;
        if (target === "first") {
          handleOpenModal(pokemonsList[0].name);
        } else if (target === "last") {
          handleOpenModal(pokemonsList[pokemonsList.length - 1].name);
        }
      }
    },
    [handleOpenModal]
  );

  const activePokemonList = searched ? pokemon : pagePokemons;
  const currentPokemonIndex = activePokemonList.findIndex((p) => {
    if (!p || !pokemonDetails) return false;
    return (
      p.id === pokemonDetails.id ||
      p.name?.toLowerCase() === pokemonDetails.name?.toLowerCase()
    );
  });

  const hasPrev = searched
    ? currentPokemonIndex > 0
    : currentPokemonIndex >= 0
    ? currentPokemonIndex > 0 || page > 0
    : Boolean(pokemonDetails?.id && pokemonDetails.id > 1);

  const hasNext = searched
    ? currentPokemonIndex >= 0 && currentPokemonIndex < activePokemonList.length - 1
    : currentPokemonIndex >= 0
    ? currentPokemonIndex < activePokemonList.length - 1 || page < totalPages - 1
    : Boolean(pokemonDetails?.id);

  const handlePrevPokemon = useCallback(() => {
    if (searched) {
      if (currentPokemonIndex > 0) {
        handleOpenModal(activePokemonList[currentPokemonIndex - 1].name);
      }
      return;
    }

    if (currentPokemonIndex >= 0) {
      if (currentPokemonIndex > 0) {
        handleOpenModal(activePokemonList[currentPokemonIndex - 1].name);
      } else if (page > 0) {
        pendingTargetRef.current = "last";
        setPage((prev) => prev - 1);
      }
    } else if (pokemonDetails?.id && pokemonDetails.id > 1) {
      handleOpenModal(pokemonDetails.id - 1);
    }
  }, [searched, currentPokemonIndex, activePokemonList, page, pokemonDetails, handleOpenModal]);

  const handleNextPokemon = useCallback(() => {
    if (searched) {
      if (currentPokemonIndex >= 0 && currentPokemonIndex < activePokemonList.length - 1) {
        handleOpenModal(activePokemonList[currentPokemonIndex + 1].name);
      }
      return;
    }

    if (currentPokemonIndex >= 0) {
      if (currentPokemonIndex < activePokemonList.length - 1) {
        handleOpenModal(activePokemonList[currentPokemonIndex + 1].name);
      } else if (page < totalPages - 1) {
        pendingTargetRef.current = "first";
        setPage((prev) => prev + 1);
      }
    } else if (pokemonDetails?.id) {
      handleOpenModal(pokemonDetails.id + 1);
    }
  }, [searched, currentPokemonIndex, activePokemonList, page, totalPages, pokemonDetails, handleOpenModal]);

  useEffect(() => {
    if (!pokemonModalVal) return;
    loadPokemonDetails(pokemonModalVal);
  }, [pokemonModalVal]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!closeModal || isTeamOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [closeModal, isTeamOpen]);

  // Ensure grid view is active on mobile screens (< 768px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768 && !isList) {
        setIslist(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isList]);

  return (
    <>
      {/* Skip to Main Content Link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white font-bold"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {searchStatus}
      </div>

      {/* Team Builder Modal */}
      <TeamBuilder
        team={team}
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
        onRemoveMember={(idOrName) => {
          setTeam((prev) => {
            const next = prev.filter(
              (t) => t.id !== idOrName && t.name !== idOrName
            );
            setStoredItem("pokedex:team", next);
            return next;
          });
        }}
        onClearTeam={() => {
          setTeam([]);
          setStoredItem("pokedex:team", []);
        }}
        onSelectPokemon={(name) => handleOpenModal(name)}
      />

      {/* Pokémon Details Modal */}
      {!closeModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
            onClick={() => handleCloseModal(true)}
          />
          <div className="relative w-full h-full pointer-events-none">
            <Modal
              setCloseModal={handleCloseModal}
              pokemon={pokemonDetails}
              closeMdoal={closeModal}
              onSelectPokemon={handleOpenModal}
              isFavorite={isFav(pokemonDetails)}
              onToggleFavorite={handleToggleFavorite}
              isInTeam={inTeam(pokemonDetails)}
              onToggleTeam={handleToggleTeam}
              onPrevPokemon={handlePrevPokemon}
              onNextPokemon={handleNextPokemon}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          </div>
        </div>
      )}

      <div
        className="w-full min-h-screen overflow-auto"
        style={{
          backgroundColor: "#f8f8f8",
          backgroundImage: `url(${PokePattern})`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden={!closeModal || isTeamOpen ? "true" : undefined}
      >
        <div className="w-full h-full relative">
          <Logo />

          <div className="w-3/4 flex flex-col mx-auto mb-4 gap-2.5">
            <div className="w-full flex flex-row items-stretch gap-2">
              <Butons isList={isList} setIslist={setIslist} />
              <button
                type="button"
                onClick={() => setIsTeamOpen(true)}
                aria-label={`Open Battle Team (${team.length} of 6 members)`}
                title="View and manage your 6-member Pokémon team"
                className="self-stretch px-3 md:px-4 bg-white border border-gray-300 hover:border-gray-400 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs md:text-sm text-gray-800 shadow-sm focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none transition hover:bg-gray-50"
              >
                <span aria-hidden="true" className="mr-1.5 text-sm">⚔️</span>
                <span>Team ({team.length}/6)</span>
              </button>
              <Search setSearched={setSearched} getPokemon={searchPokemon} />
            </div>

            {/* Quick Filters */}
            <div className="w-full bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-200">
              <Filters
                selectedGen={selectedGen}
                onSelectGen={handleSelectGen}
                selectedType={selectedType}
                onSelectType={handleSelectType}
                isFavoritesOnly={isFavoritesOnly}
                onToggleFavorites={handleToggleFavoritesFilter}
                favoritesCount={favorites.length}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          <main id="main-content" tabIndex="-1" className="w-full focus:outline-none">
            <Grid
              isList={isList}
              setSharedPageVal={setSharedPageVal}
              setPokemonModalVal={handleOpenModal}
              searched={searched}
              searchLoading={searchLoading}
              setcloseMdoal={handleCloseModal}
              pokemon={pokemon}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              team={team}
              onToggleTeam={handleToggleTeam}
              page={page}
              setPage={setPage}
              onPokemonsLoaded={handlePokemonsLoaded}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
