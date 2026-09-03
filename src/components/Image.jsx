import React from "react";

const Image = (props) => {
  const { path, alt, className, shiny } = props;
  if (path == undefined) {
    return <div>Loading...</div>;
  }

  const normalSrc =
    path?.other?.["official-artwork"]?.front_default ||
    path?.other?.dream_world?.front_default ||
    path?.front_default ||
    "";

  const shinySrc =
    path?.other?.["official-artwork"]?.front_shiny ||
    path?.front_shiny ||
    normalSrc;

  const imgSrc = shiny ? shinySrc : normalSrc;

  return (
    <img
      className={className || "mx-auto"}
      src={imgSrc}
      alt={alt}
      loading="lazy"
    />
  );
};

export default Image;
