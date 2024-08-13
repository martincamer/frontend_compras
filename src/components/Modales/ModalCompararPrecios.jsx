import { useState } from "react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { ModalViewProductos } from "./ModalViewProductos";

export const ModalCompararPrecios = () => {
  const { ordenes } = useOrdenesContext();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

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

  const handleCategoriaChange = (event) => {
    const categoria = event.target.value;
    setCategoriaSeleccionada(categoria);

    if (categoria !== "") {
      const productosAgrupados = new Map();

      ordenesFiltradas.forEach((orden) => {
        orden.datos.productoSeleccionado.forEach((producto) => {
          if (producto.categoria === categoria) {
            const key = producto.detalle.toLowerCase();
            const proveedor = orden.proveedor;
            const precio_und = parseFloat(producto.precio_und);
            const fecha = orden.created_at; // Agregar la fecha de la orden de compra

            if (productosAgrupados.has(key)) {
              const existingProducto = productosAgrupados.get(key);
              const proveedorIndex = existingProducto.proveedores.findIndex(
                (p) => p.nombre === proveedor.nombre
              );

              if (proveedorIndex === -1) {
                existingProducto.proveedores.push({
                  nombre: proveedor,
                  precio_und,
                  fecha, // Agregar fecha aquí
                });
              } else if (
                precio_und <
                existingProducto.proveedores[proveedorIndex].precio_und
              ) {
                existingProducto.proveedores[proveedorIndex].precio_und =
                  precio_und;
                existingProducto.proveedores[proveedorIndex].fecha = fecha; // Actualizar fecha si el precio es menor
              }
            } else {
              productosAgrupados.set(key, {
                ...producto,
                proveedores: [{ nombre: proveedor, precio_und, fecha }],
                fecha, // Inicializar la fecha
              });
            }
          }
        });
      });

      const productosFiltrados = Array.from(productosAgrupados.values());
      setProductosFiltrados(productosFiltrados);
    } else {
      setProductosFiltrados([]);
    }
  };

  return (
    <dialog id="my_modal_comparar_precios" className="modal">
      <div className="modal-box max-w-full h-full max-h-full w-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Filtrar productos de compras, compara precios, etc.
        </h3>
        <p className="pb-5">
          En esta sección podras filtrar productos comprados y comparar los
          precios de ellos.
        </p>

        <form onSubmit={handleFiltrarClick}>
          <div className="flex space-x-4">
            <div className="border border-gray-300 rounded-md flex items-center gap-2 px-2 py-2">
              <label className="text-sm font-bold" htmlFor="fechaInicio">
                Fecha de inicio:
              </label>
              <input
                className=" text-sm font-bold outline-none border border-gray-300 rounded-md py-1 px-2"
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="border border-gray-300 rounded-md flex items-center gap-2 px-2 py-2">
              <label className="text-sm font-bold" htmlFor="fechaFin">
                Fecha fin:
              </label>
              <input
                className=" text-sm font-bold outline-none border border-gray-300 rounded-md py-1 px-2"
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="text-sm font-bold bg-primary py-2 px-4 text-white rounded-md"
              >
                Filtrar precios, compras.
              </button>
            </div>
          </div>
        </form>
        <div className="py-4 flex gap-2 items-center">
          <label htmlFor="categoria" className="font-bold text-sm">
            Seleccionar categoría:
          </label>
          <select
            className="border border-gray-300 rounded-md px-2 py-1.5 text-sm font-semibold outline-none uppercase"
            id="categoria"
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
          >
            <option className="font-bold capitalize text-gray-400" value="">
              Seleccione una categoría
            </option>
            {/* Obtener las categorías únicas de las órdenes filtradas */}
            {ordenesFiltradas
              .flatMap((orden) => orden.datos.productoSeleccionado)
              .map((producto) => producto.categoria)
              .filter(
                (categoria, index, self) => self.indexOf(categoria) === index
              ) // Filtrar categorías únicas
              .map((categoria, index) => (
                <option className="font-semibold" key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
          </select>
          <div>
            <button
              onClick={() =>
                document.getElementById("my_modal_view_productos").showModal()
              }
              className="font-semibold text-sm border-blue-500 text-blue-500 border rounded-md py-1.5 px-4 hover:shadow transition-all hover:border-primary hover:text-primary"
            >
              Descargar o imprimir
            </button>
          </div>
        </div>

        <ul className="flex flex-col gap-2 h-[100vh] overflow-y-scroll scroll-bar px-2">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <li
                key={`${producto.detalle}-${producto.proveedores
                  .map((p) => p.nombre)
                  .join("-")}`}
                className="border border-gray-200 w-1/3 rounded-lg py-3 px-4 text-sm"
              >
                <div className="flex flex-col gap-1 divide-y divide-gray-200">
                  <p className="font-bold text-gray-800">
                    <strong>Descripción:</strong>{" "}
                    <span className="capitalize text-blue-500">
                      {producto.detalle}
                    </span>
                  </p>
                  <div>
                    <p className="font-bold text-gray-800">
                      <strong>Proveedores y Precio unitario:</strong>
                    </p>
                    <ul className="divide-y divide-gray-200">
                      {producto.proveedores.map((proveedor) => (
                        <li
                          key={`${producto.detalle}-${proveedor.nombre}`}
                          className="flex flex-col py-1"
                        >
                          <p className="capitalize">{proveedor.nombre} - </p>
                          <p className="font-semibold text-blue-500 ml-1">
                            {Number(proveedor.precio_und).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </p>
                          <span className="text-gray-600">
                            Fecha:{" "}
                            {new Date(proveedor.fecha).toLocaleDateString(
                              "es-AR"
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 px-3 text-gray-600 italic">
              No hay productos disponibles para la categoría seleccionada.
            </li>
          )}
        </ul>
        <ModalViewProductos
          fecha={fechaInicio}
          fechaFin={fechaFin}
          productos={productosFiltrados}
        />
      </div>
    </dialog>
  );
};
