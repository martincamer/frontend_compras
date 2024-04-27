import React from "react";

export const Label = ({ label }) => {
  return (
    <label className="text-[15px] text-slate-600 font-bold max-md:text-sm">
      {label}
    </label>
  );
};
