import React, { useMemo } from "react";
import { browserLang } from "../helpers/getLanguage";

const sanitizeFlavorText = (text) => {
  if (!text) return "";
  return text.replace(/[\f\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
};

const Description = ({ species }) => {
  const description = useMemo(() => {
    if (!species?.flavor_text_entries?.length) return "";
    const entries = species.flavor_text_entries;
    const langMatch = entries.find((e) => e.language?.name === browserLang);
    if (langMatch) return sanitizeFlavorText(langMatch.flavor_text);

    const enMatch = entries.find((e) => e.language?.name === "en");
    if (enMatch) return sanitizeFlavorText(enMatch.flavor_text);

    return sanitizeFlavorText(entries[0]?.flavor_text || "");
  }, [species]);

  if (!description) return null;

  return <div className="text-xl block leading-relaxed text-gray-700">{description}</div>;
};

export default Description;
