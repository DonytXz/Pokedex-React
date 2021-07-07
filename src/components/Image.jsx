import React from "react";

const Image = (props) => {
  const { path, alt } = props;
  if (path == undefined) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <img className="mx-auto" src={path.front_default} alt={alt} />
    </>
  );
};

export default Image;
