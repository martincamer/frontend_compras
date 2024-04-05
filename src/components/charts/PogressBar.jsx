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
    (Number(totalFinalAcumulado) / 10000000000) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white border-slate-200 border-[1px] py-8 px-5 rounded-xl shadow w-full max-md:py-3">
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start">
        <p className="text-slate-700 text-lg mb-3 uppercase max-md:text-sm">
          Total en compras del mes
        </p>
        <p className="text-lg mb-3 max-md:text-sm max-md:font-bold rounded-xl text-red-600">
          -{" "}
          {Number(totalFinalAcumulado).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}{" "}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-xl overflow-hidden ">
        <div
          className="h-3 max-md:h-2 bg-red-500"
          style={{ width: `${porcentajeTotal}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
