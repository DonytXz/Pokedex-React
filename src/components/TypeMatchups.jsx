import React, { useState, useEffect } from "react";
import { fetchTypeData, calculateTypeMatchups } from "../services/getPokemon";
import { TYPE_COLORS } from "./Types";

const TypeBadge = ({ typeName, multiplier }) => {
  const theme = TYPE_COLORS[typeName] || { bg: "#777777", text: "#ffffff" };

  return (
    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1.5 border border-gray-200">
      <span
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm"
      >
        {typeName}
      </span>
      <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-800">
        {multiplier}
      </span>
    </div>
  );
};

const TypeMatchups = ({ types = [] }) => {
  const [matchups, setMatchups] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTypeData = async () => {
      if (!types || types.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = types.map((t) => {
          const typeName = t.type?.name || t;
          return fetchTypeData(typeName);
        });
        const typeDataList = await Promise.all(promises);

        if (isMounted) {
          const result = calculateTypeMatchups(types, typeDataList.filter(Boolean));
          setMatchups(result);
        }
      } catch (err) {
        if (isMounted) setMatchups(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTypeData();

    return () => {
      isMounted = false;
    };
  }, [types]);

  if (loading) {
    return (
      <div className="w-full text-center py-4 text-sm text-gray-500" role="status">
        Calculating type matchups...
      </div>
    );
  }

  if (!matchups) {
    return (
      <div className="w-full text-center py-4 text-sm text-gray-500">
        No type matchup data available.
      </div>
    );
  }

  const {
    weaknesses4x,
    weaknesses2x,
    resistances05x,
    resistances025x,
    immunities0x,
  } = matchups;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Weaknesses (Takes extra damage) */}
      {(weaknesses4x.length > 0 || weaknesses2x.length > 0) && (
        <section aria-labelledby="heading-weaknesses">
          <h4
            id="heading-weaknesses"
            className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1.5 flex items-center gap-1"
          >
            <span>⚠️ Weaknesses (Takes More Damage)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {weaknesses4x.map((t) => (
              <TypeBadge key={t} typeName={t} multiplier="4×" />
            ))}
            {weaknesses2x.map((t) => (
              <TypeBadge key={t} typeName={t} multiplier="2×" />
            ))}
          </div>
        </section>
      )}

      {/* Resistances (Takes less damage) */}
      {(resistances05x.length > 0 || resistances025x.length > 0) && (
        <section aria-labelledby="heading-resistances">
          <h4
            id="heading-resistances"
            className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1.5 flex items-center gap-1"
          >
            <span>🛡️ Resistances (Takes Less Damage)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {resistances05x.map((t) => (
              <TypeBadge key={t} typeName={t} multiplier="½×" />
            ))}
            {resistances025x.map((t) => (
              <TypeBadge key={t} typeName={t} multiplier="¼×" />
            ))}
          </div>
        </section>
      )}

      {/* Immunities (Takes 0 damage) */}
      {immunities0x.length > 0 && (
        <section aria-labelledby="heading-immunities">
          <h4
            id="heading-immunities"
            className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1"
          >
            <span>✨ Immunities (Takes 0 Damage)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {immunities0x.map((t) => (
              <TypeBadge key={t} typeName={t} multiplier="0×" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TypeMatchups;
