import React from "react";

const ProgressBar = ({ ordenesMensuales }) => {
  const totalFinalAcumulado = ordenesMensuales?.reduce((total, orden) => {
    if (orden?.datos?.productoSeleccionado) {
      const totalOrden = orden.datos.productoSeleccionado.reduce(
        (subtotal, producto) => {
          return subtotal + parseInt(producto.totalFinal);
        },
        0
      );
      return total + totalOrden;
    }
    return total;
  }, 0);

  const porcentajeTotal = Math.min(
    (Number(totalFinalAcumulado) / 100000000) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white border-slate-300 border-[1px] py-8 px-5 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer w-full max-md:py-3">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-sm font-bold mb-3 uppercase max-md:text-sm">
          Total en compras del mes
        </p>
        <p className="text-sm font-bold mb-3 max-md:text-sm rounded-xl text-red-600">
          -{" "}
          {Number(totalFinalAcumulado).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}{" "}
        </p>
      </div>
      <progress
        className="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg rounded-full  [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-red-400 [&::-moz-progress-bar]:bg-red-400 w-full h-3"
        value={Number(totalFinalAcumulado)}
        max={100000000}
      ></progress>
    </div>
  );
};

export default ProgressBar;
