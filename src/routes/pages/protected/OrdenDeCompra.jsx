import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ModalCrearOrden } from "../../../components/Modales/ModalCrearOrden";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";
import { ModalVerProductos } from "../../../components/Modales/ModalVerProductos";
import { ModalEditarOrdenTotal } from "../../../components/Modales/ModalEditarOrdenTotal";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const OrdenDeCompra = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

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

  const { ordenesMensuales } = useOrdenesContext();
  const { categorias } = useProductosContext();

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

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const sortedProducts = ordenesMensuales.sort((a, b) => {
    // Convertir las fechas de creación a objetos Date
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    // Ordenar en orden descendente
    return dateB - dateA;
  });

  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredProducts = currentProducts.filter((product) => {
    const searchTermMatches = product.proveedor
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return searchTermMatches;
  });

  const totalPages = Math.ceil(ordenesMensuales.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const precioTotal = ordenesMensuales.reduce(
    (total, orden) => total + Number(orden.precio_final),
    0
  );

  // Function to calculate category totals
  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterate through invoices
    ordenesMensuales.forEach((invoice) => {
      // Extract product details
      const products = invoice.datos.productoSeleccionado;

      // Iterate through products
      products.forEach((product) => {
        const category = product.categoria;
        const totalFinal = parseInt(product.totalFinal);

        // Update total spent for the category
        if (category in categoryTotals) {
          categoryTotals[category] += totalFinal;
        } else {
          categoryTotals[category] = totalFinal;
        }
      });
    });

    // Convert categoryTotals to array format
    const categoryTotalsArray = Object.keys(categoryTotals).map((category) => ({
      category,
      total: categoryTotals[category],
    }));

    return categoryTotalsArray;
  };

  // Call the function to get category totals
  const categoryTotalsData = calculateCategoryTotals();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [isModalEditarOrden, setOpenModalEditarOrden] = useState(false);

  const openModalEditarOrden = () => setOpenModalEditarOrden(true);

  const closeModalEditarOrden = () => setOpenModalEditarOrden(false);

  return (
    <section className="max-h-full min-h-screen bg-gray-100/40 w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
          <div className="flex justify-center h-full gap-4 items-center py-8">
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
                -{" "}
                {Number(precioTotal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en compras del mes
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

        <article className="flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
          <div className="flex justify-center h-full gap-4 items-center py-8">
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
        <article className="flex items-center gap-4 hover:shadow-md transition-all ease-linear cursor-pointer shadow-xl bg-white py-4 px-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase">
              Materiales/categorias gastos totales
            </strong>

            <p className="mt-2 h-[45px] overflow-y-scroll w-full scroll-bar">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base w-full">
                <ul className="flex flex-col gap-1 w-full">
                  {categoryTotalsData.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600 w-full"
                      key={category.category}
                    >
                      <span className="font-bold">{category.category}:</span>{" "}
                      <span className="text-red-600 font-bold">
                        {" "}
                        {Number(category.total).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-sky-400  py-3 px-5 rounded-full text-sm text-white font-semibold uppercase max-md:text-xs flex gap-2 items-center hover:bg-sky-500 hover:text-white transition-all ease-in-out"
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

        <Link
          to={"/registro-ordenes"}
          className="bg-orange-400  py-3 px-5 rounded-full text-sm text-white font-semibold uppercase max-md:text-xs flex gap-2 items-center hover:bg-orange-500 hover:text-white transition-all ease-in-out"
        >
          Ver registros de ordenes
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>

        <Link
          to={"/productos-ordenes"}
          className="bg-orange-400  py-3 px-5 rounded-full text-sm text-white font-semibold uppercase max-md:text-xs flex gap-2 items-center hover:bg-orange-500 hover:text-white transition-all ease-in-out"
        >
          Ir a busqueda de productos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      </div>

      <div className="max-md:mt-2 mt-4 px-6">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-sky-400 font-semibold text-sm underline">
            Ordenes de compra
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          <input
            type="text"
            placeholder="BUSCAR POR EL PROVEEDOR O DETALLE.."
            className="w-1/4 rounded-xl py-2.5 shadow-lg font-bold px-5 bg-white text-slate-700 uppercase text-sm outline-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl transition-all ease-linear mt-6 mx-5">
        <table className="min-w-full table text-sm cursor-pointer">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Numero
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Proveedor
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Numero Factura
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Fecha de la factura
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Total Facturado
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold text-sm">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <tr className="hover:bg-gray-100/50 transition-all" key={p.id}>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 font-bold uppercase text-sm">
                  {p.id}
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                  {p.proveedor}
                </th>
                <th className="whitespace-nowrap px-4 py-4  uppercase text-sm">
                  N° {p.numero_factura}
                </th>
                <th className="whitespace-nowrap px-4 py-4  uppercase text-sm">
                  {new Date(p.fecha_factura).toLocaleDateString("ars")}
                </th>
                <th className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-sky-500">
                  {Number(p.precio_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer space-x-2 flex">
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
                      className="dropdown-content z-[1] menu p-2 shadow-lg border bg-base-100 rounded-box w-52 gap-2"
                    >
                      <li>
                        <span
                          onClick={() => {
                            handleID(p.id), openProductos();
                          }}
                          className="bg-orange-500/20 text-orange-600 hover:bg-orange-200 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
                        >
                          Ver Productos
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => {
                            handleID(p.id), openModalEditarOrden();
                          }}
                          className="bg-green-500/20 hover:bg-green-200 text-green-600 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
                        >
                          EDITAR
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </span>
                      </li>
                      <li>
                        <Link
                          to={`/orden/${p.id}`}
                          className="bg-sky-500/20 hover:bg-sky-200 text-sky-700 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
                        >
                          VER ORDEN
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
                      </li>
                      <li>
                        {" "}
                        <span
                          onClick={() => {
                            handleID(p.id), openEliminar();
                          }}
                          className="bg-red-500/10 hover:bg-red-200 text-red-800 py-2 px-3 rounded-xl text-sm flex items-center gap-1"
                        >
                          ELIMINAR
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </span>
                      </li>
                    </ul>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft />
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-white" : "bg-gray-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100`}
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
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight />
        </button>
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
    </section>
  );
};
