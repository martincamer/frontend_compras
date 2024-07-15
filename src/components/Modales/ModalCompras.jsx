import { useState } from "react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { ModalProveedores } from "./ModalProveedores";
import { ModalObtenerOrdenDeCompra } from "./ModalOrdenDeCompra";
import { useObtenerId } from "../../helpers/obtenerId";

export const ModalCompras = () => {
  const { ordenes } = useOrdenesContext();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");

  const { handleObtenerId, idObtenida } = useObtenerId();

  const filtrarPorRangoFecha = () => {
    // Validar que ambas fechas estén seleccionadas
    if (!fechaInicio || !fechaFin) {
      return;
    }

    // Convertir las fechas a objetos Date
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);

    // Filtrar las órdenes por el rango de fechas
    const filtradas = ordenes.filter((orden) => {
      const fechaOrden = new Date(orden.created_at);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });

    setOrdenesFiltradas(filtradas);
  };

  const handleFiltrarClick = (event) => {
    event.preventDefault();
    filtrarPorRangoFecha();
  };

  const handleProveedorChange = (event) => {
    const proveedor = event.target.value;
    setProveedorSeleccionado(proveedor);

    // Filtrar las órdenes por proveedor seleccionado
    const filtradas = proveedor
      ? ordenes.filter((orden) => orden.proveedor === proveedor)
      : ordenes;

    setOrdenesFiltradas(filtradas);
  };

  // Obtener la lista única de proveedores
  const listaProveedores = Array.from(
    new Set(ordenes.map((orden) => orden.proveedor))
  );

  const precioFinalTotal = ordenesFiltradas.reduce((total, orden) => {
    return total + parseFloat(orden.precio_final);
  }, 0);

  const precioFinalIva = ordenesFiltradas.reduce((total, orden) => {
    return (
      total +
      parseFloat(
        orden.datos.productoSeleccionado.reduce(
          (subtotal, producto) => subtotal + parseFloat(producto.totalFinal),
          0
        )
      )
    );
  }, 0);
  return (
    <dialog id="my_modal_compras" className="modal">
      <div className="modal-box max-w-full h-full max-h-full w-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Filtrar ordenes de compras, comparar precios, etc.
        </h3>
        <p className="py-4">
          En esta sección podras filtrar ordenes de compra y comparar los
          precios de ellas.
        </p>

        <form onSubmit={handleFiltrarClick}>
          <div className="flex space-x-4">
            <div className="border border-blue-500 flex items-center gap-2 px-2 py-2">
              <label className="text-sm font-bold" htmlFor="fechaInicio">
                Fecha de inicio:
              </label>
              <input
                className="text-blue-500 text-sm font-bold outline-none border border-blue-500 py-1 px-2"
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="border border-blue-500 flex items-center gap-2 px-2 py-2">
              <label className="text-sm font-bold" htmlFor="fechaFin">
                Fecha fin:
              </label>
              <input
                className="text-blue-500 text-sm font-bold outline-none border border-blue-500 py-1 px-2"
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="text-sm font-bold bg-blue-500 py-2 px-4 text-white rounded-full"
              >
                Filtrar
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="proveedor" className="text-sm font-bold">
              Filtrar por proveedor:
            </label>
            <select
              id="proveedor"
              className="text-sm font-bold outline-none border border-blue-500 py-1 px-2 ml-2 capitalize"
              value={proveedorSeleccionado}
              onChange={handleProveedorChange}
            >
              <option className="text-blue-500 font-bold" value="">
                Todos los proveedores
              </option>
              {listaProveedores.map((proveedor) => (
                <option
                  className="font-semibold capitalize"
                  key={proveedor}
                  value={proveedor}
                >
                  {proveedor}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                document.getElementById("my_modal_proveedores").showModal()
              }
              className="bg-blue-500 hover mt-2 py-1.5 px-4 rounded-full text-white text-sm font-semibold ml-3"
            >
              Imprimir o descargar compras por proveedor
            </button>
          </div>
        </form>
        <div className="bg-blue-50 py-5 px-10 mt-5 flex gap-12">
          <div>
            <p className="font-bold text-sm">Total en compras filtradas</p>
            <p className="font-extrabold text-blue-500 text-xl">
              {" "}
              {Number(precioFinalTotal).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>{" "}
          <div>
            <p className="font-bold text-sm">Total sin iva en compras</p>
            <p className="font-extrabold text-blue-500 text-xl">
              {" "}
              {Number(precioFinalIva).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>
          <div>
            <p className="font-bold text-sm">Total iva en compras</p>
            <p className="font-extrabold text-blue-500 text-xl">
              {" "}
              {Number(precioFinalTotal - precioFinalIva).toLocaleString(
                "es-AR",
                {
                  style: "currency",
                  currency: "ARS",
                }
              )}
            </p>
          </div>
        </div>
        <div className="bg-white transition-all ease-linear mt-4 py-5 px-2 mb-10">
          <div className="overflow-y-scroll scroll-bar h-[100vh] px-4">
            <table className="min-w-full table text-xs cursor-pointer">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Numero
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Proveedor
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Numero Factura
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Fecha de la factura
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Fecha de creación
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Total Facturado
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordenesFiltradas.map((p) => (
                  <tr
                    className="hover:bg-gray-100/50 transition-all"
                    key={p.id}
                  >
                    <th className="whitespace-nowrap px-4 py-4 text-gray-700 font-bold uppercase text-xs">
                      {p.id}
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs">
                      {p.proveedor}
                    </th>
                    <th className="whitespace-nowrap px-4 py-4  uppercase text-xs">
                      N° {p.numero_factura}
                    </th>
                    <th className="whitespace-nowrap px-4 py-4  uppercase text-xs">
                      {new Date(p.fecha_factura).toLocaleDateString("ars")}
                    </th>{" "}
                    <th className="whitespace-nowrap px-4 py-4  uppercase text-xs">
                      {new Date(p.created_at).toLocaleDateString("ars")}
                    </th>
                    <th className="whitespace-nowrap px-4 py-4  uppercase text-xs">
                      <div className="flex">
                        <p className="bg-blue-500 py-1.5 rounded text-white font-bold px-3">
                          {Number(p.precio_final).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </p>
                      </div>
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer">
                      <div className="flex">
                        <p
                          className={`${
                            (p.estado === "pendiente" &&
                              "bg-orange-100 text-orange-600") ||
                            (p.estado === "rechazada" &&
                              "bg-red-50 text-red-600") ||
                            (p.estado === "aceptada" &&
                              "bg-green-50 text-green-600")
                          } py-1 px-2 rounded capitalize text-sm`}
                        >
                          {p.estado}
                        </p>
                      </div>
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-gray-700 text-sm cursor-pointer">
                      <div className="flex">
                        <button
                          onClick={() => {
                            handleObtenerId(p.id),
                              document
                                .getElementById("my_modal_orden_compra")
                                .showModal();
                          }}
                          type="button"
                          className="bg-blue-500 py-1 px-4 rounded text-white"
                        >
                          Descargar orden
                        </button>
                      </div>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ModalProveedores
          fechaFin={fechaFin}
          fechaInicio={fechaInicio}
          compras={ordenesFiltradas}
          total={precioFinalTotal}
        />
        <ModalObtenerOrdenDeCompra idObtenida={idObtenida} />
      </div>
    </dialog>
  );
};
