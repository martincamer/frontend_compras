import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-sky-500 font-bold py-2.5 px-6 w-full rounded-ful text-white rounded-full"
      type={type}
    >
      {titulo}
    </button>
  );
};
