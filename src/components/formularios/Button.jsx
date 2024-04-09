import React from "react";

export const Button = ({ type, titulo }) => {
  return (
    <button
      className="bg-indigo-100 py-2 px-6 w-full rounded-xl text-indigo-600 text-base  hover:shadow-slate-300 hover:shadow-md  transition-all ease-in-out duration-300 max-md:text-sm"
      type={type}
    >
      {titulo}
    </button>
  );
};
