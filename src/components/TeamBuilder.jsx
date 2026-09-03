import React, { useEffect, useRef } from "react";
import Image from "./Image";
import Types from "./Types";
import { calculateBaseStatTotal } from "../services/getPokemon";

const TeamBuilder = ({
  team = [],
  isOpen,
  onClose,
  onRemoveMember,
  onClearTeam,
  onSelectPokemon,
}) => {
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalTeamBST = team.reduce(
    (acc, p) => acc + calculateBaseStatTotal(p),
    0
  );
  const avgTeamBST = team.length > 0 ? Math.round(totalTeamBST / team.length) : 0;

  // Count types across team
  const typeCounts = {};
  team.forEach((p) => {
    p.types?.forEach((t) => {
      const typeName = t.type?.name || t;
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-builder-title"
        className="relative w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-100 flex flex-col z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2
              id="team-builder-title"
              className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2"
            >
              <span>⚔️ Battle Team Builder</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                {team.length} / 6 Members
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Build and analyze your 6-Pokémon dream squad.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {team.length > 0 && (
              <button
                type="button"
                onClick={onClearTeam}
                aria-label="Clear all team members"
                className="text-xs font-semibold text-red-600 hover:text-red-800 px-2.5 py-1 rounded border border-red-200 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none"
              >
                Clear Team
              </button>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close Team Builder"
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 6 Team Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 py-4">
          {Array.from({ length: 6 }).map((_, idx) => {
            const member = team[idx];

            if (member) {
              const bst = calculateBaseStatTotal(member);
              return (
                <div
                  key={member.id || member.name}
                  className="bg-white border-2 border-green-500 rounded-xl p-3 flex flex-col items-center relative shadow-sm hover:shadow transition"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveMember && onRemoveMember(member.id || member.name)}
                    aria-label={`Remove ${member.name} from team`}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onSelectPokemon) onSelectPokemon(member.name);
                    }}
                    aria-label={`View ${member.name} details`}
                    className="w-full flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg p-1"
                  >
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Image path={member.sprites} alt={member.name} />
                    </div>
                    <span className="font-bold capitalize text-xs text-gray-900 truncate w-full text-center mt-1">
                      {member.name}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">
                      BST: {bst}
                    </span>
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {member.types?.map((t, i) => (
                        <Types key={i} type={t.type || t} />
                      ))}
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={`empty-${idx}`}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] text-gray-400 bg-gray-50"
              >
                <span className="text-2xl mb-1">⚪</span>
                <span className="text-xs font-semibold text-gray-500">
                  Slot {idx + 1}
                </span>
                <span className="text-[10px] text-gray-400 text-center mt-0.5">
                  Empty
                </span>
              </div>
            );
          })}
        </div>

        {/* Team Synergy & Stats Footer */}
        {team.length > 0 && (
          <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-500 block">Total BST:</span>
                <span className="text-base font-bold text-gray-900">{totalTeamBST}</span>
              </div>
              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-gray-500 block">Average BST:</span>
                <span className="text-base font-bold text-gray-900">{avgTeamBST}</span>
              </div>
            </div>

            {/* Types Represented */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-gray-500 mr-1 font-semibold">Types:</span>
              {Object.entries(typeCounts).map(([typeName, count]) => (
                <span
                  key={typeName}
                  className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold capitalize"
                >
                  {typeName} ({count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;
