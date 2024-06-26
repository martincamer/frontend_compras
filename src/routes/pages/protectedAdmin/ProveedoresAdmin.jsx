import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProveedor } from "../../../components/Modales/ModalCrearProveedor";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfProveedores } from "../../../components/pdf/PdfProveedores";
import { AiOutlineSearch } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import clsx from "clsx"; // Para concatenar clases de manera condicional

export const ProveedoresAdmin = () => {
  const { proveedoresAdmin } = useProductosContext();

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const [activeTab, setActiveTab] = useState(0); // 0 significa la primera pestaña

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const [isOpen, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15); // Número de productos por página
  const [busqueda, setBusqueda] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("all");

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
  };

  // Obtén todas las localidades únicas para llenar el control de selección
  const localidades = Array.from(
    new Set(proveedoresAdmin.map((prov) => prov.localidad))
  );

  const [handleIsOpen, setHandleOpen] = useState(false);

  const handleToggle = () => {
    setHandleOpen(!handleIsOpen); // Alternar el estado de apertura/cierre
  };
  const inputRef = useRef(null); // Para referenciar el campo de búsqueda

  // Cierra el campo de búsqueda si se hace clic fuera del componente
  const handleClickOutside = (event) => {
    if (
      handleIsOpen &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setHandleOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // Agrega el event listener global
    return () => {
      document.removeEventListener("click", handleClickOutside); // Limpia el listener para evitar fugas de memoria
    };
  }, [handleIsOpen]); // Solo agrega el listener si el campo de búsqueda está abierto

  // Filtrar productos en función de la búsqueda y la localidad seleccionada
  const productosFiltrados = proveedoresAdmin?.filter((producto) => {
    const proveedorCoincide = producto.proveedor
      ?.toLowerCase()
      ?.includes(busqueda?.toLowerCase());
    const localidadCoincide =
      selectedLocalidad === "all" ||
      producto.localidad_usuario === selectedLocalidad;

    return proveedorCoincide && localidadCoincide;
  });

  const uniqueLocalidad = Array.from(
    new Set(
      proveedoresAdmin.map((orden) => orden?.localidad_usuario?.toLowerCase())
    )
  );

  // Lógica de paginación basada en productos filtrados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = productosFiltrados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const precioTotal = proveedoresAdmin.reduce(
    (total, orden) => total + Number(orden.total),
    0
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="bg-gray-100/50 min-h-screen max-h-full w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5 max-md:hidden">
        <ToastContainer />
        <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
          <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-4 px-6">
            <div className="flex justify-center h-full gap-4 items-center">
              <span className="rounded-full bg-red-100 p-3 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-red-700">
                  {" "}
                  {Number(precioTotal).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>

                <p className="text-sm text-gray-500 uppercase underline">
                  Total en proveedores/deuda
                </p>
              </div>
            </div>

            <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-medium">
                {" "}
                {Number(precioTotal / 100000).toFixed(2)} %
              </span>
            </div>
          </article>

          <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-4 px-6">
            <div className="flex justify-center h-full gap-4 items-center">
              <span className="rounded-full bg-green-100 p-3 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-green-700 uppercase">
                  {nombreMesActual}
                </p>

                <p className="text-sm text-gray-500 uppercase underline">
                  MES ACTUAL
                </p>
              </div>
            </div>

            <div className="inline-flex gap-2 rounded-xl bg-green-100 py-2 px-4 text-green-600">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <span className="text-xs font-medium uppercase">
                {" "}
                {nombreDiaActual}{" "}
              </span>
            </div>
          </article>

          <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
            <div className="flex justify-center h-full gap-4 items-center">
              <span className="rounded-full bg-green-100 p-3 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-9 h-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </span>

              <div>
                <p className="text-2xl font-medium text-green-700">
                  {Number(proveedoresAdmin.length)}
                </p>

                <p className="text-sm text-gray-500 uppercase underline">
                  Total Proveedores cargados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>

              <span className="text-xs font-medium">
                {" "}
                {Number(proveedoresAdmin.length / 1).toFixed(2)} %{" "}
              </span>
            </div>
          </article>
        </div>

        <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
          <PDFDownloadLink
            className=" text-sm text-white bg-green-500/90 py-3 px-6 rounded-full font-semibold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear"
            document={<PdfProveedores datos={proveedoresAdmin} />}
          >
            Descargar lista de proveedores
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </PDFDownloadLink>
        </div>

        <div className="mx-8 mt-6">
          <p className="underline text-sky-400 uppercase font-semibold">
            Proveedores tabla de saldos
          </p>
        </div>

        <div className="mx-8 mt-3 w-1/3 flex gap-3">
          <input
            type="text"
            placeholder="Buscar por proveedor..."
            value={busqueda}
            onChange={handleBusquedaChange}
            className="uppercase py-2 px-3 border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500 w-full"
          />

          <select
            className="font-bold py-1 px-4 text-slate-700 rounded-xl shadow bg-white border-slate-300 border-[1px] uppercase text-sm"
            value={selectedLocalidad}
            onChange={handleLocalidadChange}
          >
            <option value="all">Todas las localidades</option>
            {uniqueLocalidad.map((c) => (
              <option>{c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto mt-6 mx-8 rounded-2xl border-slate-300 border-[1px] transition-all hover:shadow-md ease-linear cursor-pointer">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Localidad/usuario
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Fabrica/usuario
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Proveedor
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Localidad
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Total Deber
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Total final deber
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((p) => (
                <tr className="hover:bg-gray-100/40 transition-all" key={p.id}>
                  <td className="whitespace-nowrap px-4 py-6 font-bold text-gray-900 uppercase text-sm">
                    {p.localidad_usuario}
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 font-bold text-gray-900 uppercase text-sm">
                    {p.fabrica}
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                    {p.proveedor}
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                    {p.localidad}
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm">
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 text-red-800 uppercase text-sm font-bold">
                    {" "}
                    <span className="bg-red-50 py-3 px-5 rounded-xl">
                      {Number(p.total).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm cursor-pointer space-x-2 flex">
                    <Link
                      to={`/proveedores/${p.id}`}
                      className="bg-green-500/20 text-green-700 py-2 px-3 rounded-xl text-sm flex gap-2 items-center"
                    >
                      VER O CARGAR COMPROBANTES/DINERO{" "}
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
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>
                    {/* <span className="bg-red-500/10 text-red-800 py-2 px-3 rounded-xl text-sm">
                    ELIMINAR
                  </span> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          {proveedoresAdmin.length > productsPerPage && (
            <nav className="pagination">
              <ul className="pagination-list flex gap-2">
                {Array.from({
                  length: Math.ceil(proveedoresAdmin.length / productsPerPage),
                }).map(
                  (_, index) =>
                    index >= currentPage - 2 &&
                    index <= currentPage + 2 && ( // Mostrar solo 5 páginas a la vez
                      <li key={index} className="pagination-item">
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`pagination-link ${
                            currentPage === index + 1
                              ? "text-white bg-green-500 px-3 py-1 rounded-xl"
                              : "text-slate-600 bg-white border-[1px] border-slate-300 px-2 py-1 rounded-xl"
                          }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                )}
              </ul>
            </nav>
          )}
        </div>

        <ModalCrearProveedor isOpen={isOpen} closeModal={closeModal} />
      </section>

      <div className="py-12 w-full md:hidden bg-gray-100/40">
        <div>
          <p className="text-sky-500 mb-4 text-center font-semibold">
            Proveedores
          </p>
        </div>
        <Tab.Group
          selectedIndex={activeTab} // Controla la pestaña activa
          onChange={(index) => setActiveTab(index)} // Cambia el estado cuando el usuario cambia de pestaña
        >
          <Tab.List className="flex gap-2 bg-gray-200 py-2 px-2 w-full justify-center">
            <Tab
              className={clsx(
                "py-2 px-3 rounded-xl text-sm transition-colors duration-300 outline-none",
                {
                  "bg-sky-500 text-white": activeTab === 0, // Aplica color azul para la pestaña activa
                  "bg-white text-gray-700": activeTab !== 0, // Color blanco para las no activas
                }
              )}
            >
              Estadistica proveedores
            </Tab>

            <Tab
              className={clsx(
                "py-2 px-3 rounded-xl text-sm transition-colors duration-300 outline-none",
                {
                  "bg-sky-500 text-white": activeTab === 1, // Segunda pestaña activa
                  "bg-white text-gray-700": activeTab !== 1, // Color blanco si no está activa
                }
              )}
            >
              Ver proveedores{" "}
            </Tab>
          </Tab.List>
          <Tab.Panels
            className="transition-transform duration-300" // Transición suave entre paneles
          >
            <Tab.Panel key="1" className={"py-5 px-5"}>
              <div className="rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
                <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-4 px-6">
                  <div className="flex justify-center h-full gap-4 items-center">
                    <div>
                      <p className="text-2xl font-medium text-red-700">
                        {" "}
                        {Number(precioTotal).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>

                      <p className="text-sm text-gray-500 uppercase underline">
                        Total en proveedores/deuda
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>

                    <span className="text-xs font-medium">
                      {" "}
                      {Number(precioTotal / 100000).toFixed(2)} %
                    </span>
                  </div>
                </article>

                <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-4 px-6">
                  <div className="flex justify-center h-full gap-4 items-center">
                    <div>
                      <p className="text-2xl font-medium text-green-700 uppercase">
                        {nombreMesActual}
                      </p>

                      <p className="text-sm text-gray-500 uppercase underline">
                        MES ACTUAL
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex gap-2 rounded-xl bg-green-100 py-2 px-4 text-green-600">
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
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>

                    <span className="text-xs font-medium uppercase">
                      {" "}
                      {nombreDiaActual}{" "}
                    </span>
                  </div>
                </article>

                <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
                  <div className="flex justify-center h-full gap-4 items-center">
                    <div>
                      <p className="text-2xl font-medium text-green-700">
                        {Number(proveedoresAdmin.length)}
                      </p>

                      <p className="text-sm text-gray-500 uppercase underline">
                        Total Proveedores cargados
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>

                    <span className="text-xs font-medium">
                      {" "}
                      {Number(proveedoresAdmin.length / 1).toFixed(2)} %{" "}
                    </span>
                  </div>
                </article>
              </div>
            </Tab.Panel>
            <Tab.Panel key="2">
              <div
                className="relative flex items-center my-2 mx-2"
                ref={inputRef}
              >
                {/* Icono de búsqueda para abrir/cerrar el campo */}
                <button
                  onClick={handleToggle}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <AiOutlineSearch className="text-gray-700 text-2xl" />
                </button>

                {/* Campo de entrada que se expande al hacer clic */}
                <input
                  type="text"
                  placeholder="Buscar por el proveedor o detalle..."
                  className={clsx(
                    "rounded-xl py-2.5 px-5 border-slate-300 text-slate-700 border-[1px] uppercase text-sm absolute top-0 left-0 z-[100] transition-all outline-none",
                    {
                      "w-full bg-white opacity-100": handleIsOpen,
                      "w-0 opacity-0": !handleIsOpen,
                    }
                  )}
                  value={busqueda}
                  onChange={handleBusquedaChange}
                  style={{ left: handleIsOpen ? "0" : "-100px" }} // Controla el desplazamiento horizontal
                />
              </div>
              <div className="py-2 px-2 overflow-x-scroll scrollbar-hidden ">
                <div className="flex gap-2">
                  <select
                    className="font-bold py-1.5 px-4 text-slate-700 rounded-xl bg-white border-[1px] uppercase text-sm"
                    value={selectedLocalidad}
                    onChange={handleLocalidadChange}
                  >
                    <option value="all">Todas las localidades</option>
                    {uniqueLocalidad.map((c) => (
                      <option>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 py-5">
                {" "}
                {/* Organiza las tarjetas en una cuadrícula de una sola columna */}
                {productosFiltrados.map((product) => (
                  <CardComponent key={product.id} product={product} />
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

const CardComponent = ({ product }) => (
  <div className="bg-white p-4 border border-gray-200">
    <div className="flex justify-between items-center">
      <h3 className="text-base font-bold text-gray-800 uppercase">
        Proveedor: {product.proveedor}
      </h3>
      <div className="dropdown dropdown-left">
        <button
          tabIndex={0}
          role="button"
          className="hover:bg-gray-200 rounded-full p-2 transition-all  cursor-pointer"
        >
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
              d="M6 6h12M6 12h12M6 18h12"
            />
          </svg>
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content z-[100] menu p-2 shadow-lg border bg-white rounded-box w-52 gap-2"
        >
          <li>
            <Link
              to={`/proveedores/${product.id}`}
              className="bg-sky-500/20 hover:bg-sky-200 text-sky-700 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
            >
              Ver proveedor
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
                  d="M17.25 8.25L21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <p className="text-gray-600">Fábrica/Usuario: {product.fabrica}</p>
    <p className="text-gray-600">
      Localidad/Usuario: {product.localidad_usuario}
    </p>
    <p className="text-gray-600 flex flex-col gap-3">
      Total deuda{" "}
      <div>
        <span className="bg-red-50 py-3 px-5 rounded-xl text-red-800 font-bold text-sm">
          {Number(product.total).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </span>
      </div>
    </p>
  </div>
);
