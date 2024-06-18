import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProveedor } from "../../../components/Modales/ModalCrearProveedor";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfProveedores } from "../../../components/pdf/PdfProveedores";
import { ModalFiltrarComprobantes } from "../../../components/Modales/ModalFiltrarComprobantes";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import client from "../../../api/axios";
import { CgSearch } from "react-icons/cg";
import { ModalActualizarProveedor } from "../../../components/Modales/ModalActualizarProveedor";
import { useObtenerId } from "../../../helpers/obtenerId";
import { ModalEliminarProveedor } from "../../../components/Modales/ModalEliminarProveedor";

export const Proveedores = () => {
  const { proveedores } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  const { handleObtenerId, idObtenida } = useObtenerId();

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes-mes");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

  const totalAcumulado = comprobantesMensuales.reduce((acumulado, item) => {
    const totalNum = parseFloat(item.total); // Convertir a número
    return acumulado + totalNum;
  }, 0); // Inicia la acumulación desde cero

  console.log(totalAcumulado);

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Ordenar por el total de mayor a menor
  const sortedProveedores = [...proveedores].sort((a, b) => b.total - a.total);

  // Filtrar productos por el término de búsqueda antes de la paginación
  const filteredProveedores = sortedProveedores.filter((product) =>
    product.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProveedores.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProveedores.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const precioTotal = sortedProveedores.reduce(
    (total, orden) => total + Number(orden.total),
    0
  );

  return (
    <section className="w-full min-h-screen h-full max-h-full">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-sky-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/proveedores"}
          className="bg-sky-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Proveedores
        </Link>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10">
        <h3 className="text-xl font-bold text-sky-500">
          Crea nuevos proveedores, carga comprobantes, etc.
        </h3>
      </div>
      {/* <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article
          className="rounded
         flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-10 px-6"
        >
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
              {Number(precioTotal % 100).toFixed(2)} %
            </span>
          </div>
        </article>

        <article className="rounded flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
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
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {" "}
                {Number(totalAcumulado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en comprobantes
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600">
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
              {Number(totalAcumulado % 100).toFixed(2)} %
            </span>
          </div>
        </article>

        <article className="rounded flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
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

        <article className="rounded flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-10 px-6">
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
                {Number(proveedores.length)}
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
              {Number(proveedores.length % 100).toFixed(2)} %{" "}
            </span>
          </div>
        </article>
      </div> */}

      <div className="bg-white py-5 px-5 mx-5 my-10">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de los proveedores
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm">
                  Total en proveedores/deuda
                </p>
                <p className="font-bold text-lg text-red-500">
                  {precioTotal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm">Total en comprobantes</p>
                <p className="font-bold text-lg text-sky-500">
                  {totalAcumulado.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>{" "}
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm">Total de proveedores</p>
                <p className="font-bold text-lg text-sky-500">
                  {proveedores.length}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="mx-5 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="text-white bg-sky-400 py-2.5 px-6 rounded font-bold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
        >
          Crear nuevo proveedor/ editar,etc
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
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        </button>

        <PDFDownloadLink
          className=" text-sm text-white bg-green-500/90 py-2.5 px-6 rounded font-bold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear"
          document={<PdfProveedores datos={proveedores} />}
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

        <button
          className=" text-sm text-white bg-green-500/90 py-3 px-6 rounded font-bold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear outline-none"
          onClick={() =>
            document.getElementById("my_modal_proveedores").showModal()
          }
        >
          Descargar lista proveedores comprobantes
        </button>
      </div>

      <div className="mt-6 w-1/3 border border-sky-500 py-3 px-3 text-sm font-semibold flex items-center justify-between bg-white mx-5">
        <input
          className="w-full outline-none"
          type="text"
          placeholder="Buscar por proveedores existentes..."
          value={searchTerm}
          onChange={(e) => sd(e.target.value)}
        />
        <CgSearch className="text-sky-500" />
      </div>

      <div className="mt-6 cursor-pointer mx-5">
        <table className="min-w-full bg-white table rounded-none">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bold text-xs">
                Proveedor
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bold text-xs">
                Total Deber
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bold text-xs">
                Total final deber
              </th>

              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bold text-xs">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((p) => (
              <tr className="hover:bg-gray-100/40 transition-all" key={p.id}>
                <th className="whitespace-nowrap px-4 py-6 font-bold text-gray-900 uppercase text-xs">
                  {p.proveedor}
                </th>
                <th className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-xs">
                  {Number(p.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </th>
                <th className="whitespace-nowrap px-4 py-6  uppercase text-xs font-bold">
                  {" "}
                  <span
                    className={`${
                      p.total > 0
                        ? "bg-red-50 text-red-800"
                        : "bg-sky-50 text-sky-800"
                    } py-3 px-5 rounded`}
                  >
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </th>
                <th>
                  <div className="flex">
                    <p
                      className={`${
                        p.total > 0
                          ? "bg-orange-100 text-orange-500"
                          : "bg-green-100 text-green-500"
                      } py-3 px-5 rounded`}
                    >
                      {p.total > 0
                        ? "Deudas con el proveedor, pagar ahora"
                        : "Sin deudas con el proveedor.."}
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
                      className="dropdown-content z-[1] menu p-3 border-sky-300 border bg-white w-52 gap-2"
                    >
                      <Link
                        to={`/proveedores/${p.id}`}
                        className="hover:text-sky-500 transition-all text-left hover:underline text-xs capitalize"
                      >
                        Cargar comprobantes{" "}
                      </Link>{" "}
                      <button
                        onClick={() => {
                          handleObtenerId(p.id),
                            document
                              .getElementById("my_modal_editar_proveedor")
                              .showModal();
                        }}
                        type="button"
                        className="hover:text-sky-500 transition-all text-left hover:underline text-xs"
                      >
                        Editar proveedor{" "}
                      </button>{" "}
                      <button
                        onClick={() => {
                          handleObtenerId(p.id),
                            document
                              .getElementById("my_modal_eliminar_proveedor")
                              .showModal();
                        }}
                        type="button"
                        className="hover:text-red-500 transition-all text-left hover:underline text-xs"
                      >
                        Eliminar proveedor{" "}
                      </button>
                    </ul>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-center items-center space-x-2 pb-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-sky-300 py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-sky-400 hover:text-white focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft />
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-sky-200" : "bg-sky-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-white hover:bg-sky-500 focus:outline-none focus:bg-sky-300`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-sky-300 py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-sky-400 hover:text-white focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight />
        </button>
      </div>

      <ModalCrearProveedor isOpen={isOpen} closeModal={closeModal} />
      <ModalFiltrarComprobantes />
      <ModalActualizarProveedor idObtenida={idObtenida} />
      <ModalEliminarProveedor idObtenida={idObtenida} />
    </section>
  );
};
