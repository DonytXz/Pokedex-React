import React from "react";

const Types = (props) => {
  const { type } = props;
  return (
    <>
      <div className="self-start bg-green-600 p-1 mb-2">
        <p className="text-white uppercase">{type.name}</p>
      </div>
    </>
  );
};

export default Types;
