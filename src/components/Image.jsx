import React from "react";

const Image = (props) => {
  const { path, alt, className } = props;
  if (path == undefined) {
    return <div>Loading...</div>;
  }

  const imgSrc =
    path?.other?.["official-artwork"]?.front_default ||
    path?.other?.dream_world?.front_default ||
    path?.front_default ||
    "";

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
