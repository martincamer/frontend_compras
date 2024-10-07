import React from "react";

export const Label = ({ label }) => {
  return (
    <label className="text-[15px] text-gray-400 font-bold max-md:text-sm">
      {label}.
    </label>
  );
};
