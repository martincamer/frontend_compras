import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { ModalCrearOrden } from "../../../components/Modales/ModalCrearOrden";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";
import { ModalVerProductos } from "../../../components/Modales/ModalVerProductos";
import { ModalEditarOrdenTotal } from "../../../components/Modales/ModalEditarOrdenTotal";
import { Link } from "react-router-dom";
import { CgSearch } from "react-icons/cg";
import { ModalActualizarOrdenEstado } from "../../../components/Modales/ModalActualizarOrdenEstado";
import { ModalCompararPrecios } from "../../../components/Modales/ModalCompararPrecios";
import { ModalCompras } from "../../../components/Modales/ModalCompras";

export const OrdenDeCompra = () => {
  const [isOpenEliminar, setIsOpenEliminar] = useState(false);
  const [isProductos, setIsProductos] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeEliminar = () => {
    setIsOpenEliminar(false);
  };

  const openProductos = () => {
    setIsProductos(true);
  };

  const closeProductos = () => {
    setIsProductos(false);
  };

  const handleID = (id) => setObtenerId(id);

  const { ordenes } = useOrdenesContext();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(fechaInicioPorDefecto);
  const [endDate, setEndDate] = useState(fechaFinPorDefecto);

  // Filtrar por fabrica_sucursal
  const filteredOrdenes = ordenes.filter((orden) =>
    orden.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = ordenes.filter((orden) => {
    const createdAtMonth = new Date(orden.created_at).getMonth() + 1;
    return createdAtMonth === currentMonth;
  });

  const totalPrecioFinal = filteredByMonth.reduce(
    (total, orden) => total + parseFloat(orden.precio_final),
    0
  );

  const filteredByDateRange = filteredOrdenes.filter((orden) => {
    const createdAt = new Date(orden.created_at);
    return (
      (!startDate || createdAt >= new Date(startDate)) &&
      (!endDate || createdAt <= new Date(endDate))
    );
  });

  const totalPrecioFinalFiltradas = filteredByDateRange.reduce(
    (total, orden) => total + parseFloat(orden.precio_final),
    0
  );

  // Filtrar órdenes pendientes y completadas
  const pendingOrders = filteredByDateRange.filter((orden) =>
    orden.datos.productoSeleccionado.some(
      (producto) =>
        parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
    )
  );

  const completedOrders = filteredByDateRange.filter(
    (orden) =>
      !orden.datos.productoSeleccionado.some(
        (producto) =>
          parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
      )
  );

  // Ordenar pendientes por ID descendente
  const sortedPendingOrders = pendingOrders.sort((a, b) => b.id - a.id);

  // Ordenar completadas por ID descendente
  const sortedCompletedOrders = completedOrders.sort((a, b) => b.id - a.id);

  const sortedOrdenes = [...sortedPendingOrders, ...sortedCompletedOrders];

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isModalEditarOrden, setOpenModalEditarOrden] = useState(false);

  const openModalEditarOrden = () => setOpenModalEditarOrden(true);

  const closeModalEditarOrden = () => setOpenModalEditarOrden(false);

  return (
    <section className="max-h-full min-h-screen bg-gray-100/40 w-full h-full max-md:py-12">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex max-md:hidden">
        <Link
          to={"/"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/ordenes"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Compras
        </Link>
      </div>
      <div className="bg-white py-5 px-5 mx-5 mt-10 max-md:mt-5">
        <h3 className="text-xl font-bold text-blue-500">
          Crea nuevas ordenes de compra
        </h3>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10 flex gap-3 max-md:my-5 max-md:flex-col">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de compras
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border max-md:w-80"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm">
                  Total en ordenes generadas del mes.
                </p>
                <p className="font-bold text-lg">
                  {totalPrecioFinal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm">
                  Total en ordenes filtradas del mes/semanal/etc.
                </p>
                <p className="font-bold text-lg text-blue-500">
                  {totalPrecioFinalFiltradas.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            </div>
          </ul>
        </div>
        <button
          onClick={() =>
            document.getElementById("my_modal_comparar_precios").showModal()
          }
          className="font-bold text-sm bg-green-400 py-2 px-4 text-white rounded max-md:hidden"
        >
          Ver productos/comparar/proveedores/etc
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_compras").showModal()
          }
          className="font-bold text-sm bg-blue-500 py-2 px-4 text-white rounded max-md:hidden"
        >
          Ver ordenes de compra/comparar/filtrar/etc
        </button>
      </div>
      <div className="mx-10 max-md:mx-5 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-blue-500  py-2 px-5 rounded text-sm text-white font-semibold max-md:text-xs flex gap-2 items-center hover:bg-orange-500 hover:text-white transition-all ease-in-out"
        >
          Crear nueva orden
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white my-5 mx-5 py-4 px-5 flex max-md:flex-col gap-2">
        <div className="w-1/3 max-md:w-auto border border-blue-500 py-1 px-3 text-sm font-semibold flex items-center justify-between">
          <input
            className="w-full outline-none"
            type="text"
            placeholder="Buscar por proveedores existentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CgSearch className="text-blue-500" />
        </div>

        <div className="border-blue-500 border py-1.5 px-3 text-sm font-bold flex max-md:flex-col max-md:gap-3 max-md:items-start">
          {/* Filtrador por fecha específica */}
          <div className="flex gap-2 items-center max-md:flex-col">
            <div className="flex gap-2 items-center">
              Fecha anterior{" "}
              <input
                className="border border-blue-500 py-1 px-3 outline-none"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              Fecha actual{" "}
              <input
                className="border border-blue-500 py-1 px-3 outline-none"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Filtrador por fecha del mes */}
          <button
            className="hidden bg-blue-500 text-white px-4 py-1 ml-4 rounded-full text-xs hover:bg-orange-500 transition-all"
            onClick={() => setStartDate("")}
          >
            Mostrar del mes actual
          </button>
        </div>
      </div>

      <div className="bg-white transition-all ease-linear mt-6 mx-5 py-5 px-2 mb-10">
        <div className="max-md:overflow-x-auto px-4">
          {" "}
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
                <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-xs">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="">
              {sortedOrdenes.map((p) => (
                <tr className="" key={p.id}>
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
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs cursor-pointer space-x-2 flex">
                    <div className="dropdown dropdown-left z-1">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-gray-200 rounded-full px-2 py-2 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                          />
                        </svg>
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-3 border-blue-500 border bg-white w-52 gap-2"
                      >
                        <button className="hover:text-blue-500 transition-all text-left hover:underline">
                          <span
                            onClick={() => {
                              handleID(p.id), openProductos();
                            }}
                            className=""
                          >
                            Ver Productos
                          </span>
                        </button>
                        <button
                          className="hover:text-blue-500 transition-all text-left hover:underline"
                          onClick={() => {
                            handleID(p.id),
                              document
                                .getElementById("my_modal_actualizar_estado")
                                .showModal();
                          }}
                        >
                          Actualizar estado
                        </button>
                        <button className="hover:text-blue-500 transition-all text-left hover:underline">
                          <span
                            onClick={() => {
                              handleID(p.id), openModalEditarOrden();
                            }}
                            className=""
                          >
                            Editar
                          </span>
                        </button>

                        <Link
                          to={`/orden/${p.id}`}
                          className="hover:text-blue-500 transition-all text-left capitalize hover:underline"
                        >
                          Ver orden
                        </Link>

                        <button
                          onClick={() => {
                            handleID(p.id), openEliminar();
                          }}
                          className="hover:text-red-500 transition-all text-left capitalize hover:underline"
                        >
                          Eliminar
                        </button>
                      </ul>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalCrearOrden
        obtenerId={obtenerId}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <ModalEliminar
        eliminarModal={isOpenEliminar}
        closeEliminar={closeEliminar}
        obtenerId={obtenerId}
      />
      <ModalVerProductos
        isOpen={isProductos}
        closeModal={closeProductos}
        obtenerId={obtenerId}
      />

      <ModalEditarOrdenTotal
        isOpen={isModalEditarOrden}
        closeModal={closeModalEditarOrden}
        obtenerId={obtenerId}
      />

      <ModalActualizarOrdenEstado idObtenida={obtenerId} />
      <ModalCompararPrecios />
      <ModalCompras />
    </section>
  );
};
