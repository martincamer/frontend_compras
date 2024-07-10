import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-orange-500 transition-all font-bold py-2.5 px-6 w-full rounded-ful text-white rounded-full md:text-sm"
      type={type}
    >
      {titulo}
    </button>
  );
};
