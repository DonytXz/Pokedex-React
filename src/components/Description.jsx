import React, { useState, useEffect } from "react";
import { browserLang } from "../helpers/getLanguage";
import { fetchPokemonData } from "../services/getPokemon";

const descriptions = (props) => {
  const { species } = props;
  const [descriptions, setdescriptions] = useState([]);
  const [description, setdescription] = useState([]);
  const [language, setLanguage] = useState();

  const findLangArr = (lang) => {
    let index;
    //Fin the language to show this lang description
    if (descriptions != undefined) {
      descriptions.forEach((element, i) => {
        if (element.language.name === lang) {
          index = i;
        }
      });
    }
    if (index != undefined) setdescription(descriptions[index].flavor_text);
  };
  useEffect(() => {
    if (species != undefined) setdescriptions(species.flavor_text_entries);
  }, [species]);
  useEffect(() => {
    findLangArr(browserLang);
  }, [descriptions]);
  useEffect(() => {
    if (language != undefined) getdescriptions(language);
  }, [language]);

  return (
    <>{description && <div className="text-xl block">{description}</div>}</>
  );
};

export default descriptions;
