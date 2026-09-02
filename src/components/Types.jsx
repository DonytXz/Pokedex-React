import React from "react";

const Types = (props) => {
  const { type } = props;
  if (!type?.name) return null;

  return (
    <span className="self-start inline-block bg-green-700 px-2 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wider">
      {type.name}
    </span>
  );
};

export default Types;
