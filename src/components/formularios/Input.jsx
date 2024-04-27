import React from "react";

export const Input = ({ type, placeholder, register }) => {
  return (
    <input
      {...register(type, { required: true })}
      type={type}
      placeholder={placeholder}
      className="rounded-xl py-[8px] px-2 w-full shadow-sm bg-gray-200/90 text-slate-800 font-semibold outline-none  outline-[1px] placeholder:text-sm max-md:text-sm"
    />
  );
};
