import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-primary hover:bg-blue-500 transition-all font-bold py-2.5 px-6 w-full rounded-ful text-white rounded-full md:text-sm"
      type={type}
    >
      {titulo}
    </button>
  );
};
