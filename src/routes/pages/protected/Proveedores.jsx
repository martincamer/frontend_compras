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
    <section className="w-full min-h-screen h-full max-h-full max-md:py-12">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex max-md:hidden">
        <Link
          to={"/"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/proveedores"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Proveedores
        </Link>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10 max-md:my-5">
        <h3 className="text-xl font-bold text-blue-500">
          Crea nuevos proveedores, carga comprobantes, etc.
        </h3>
      </div>

      <div className="bg-white py-5 px-5 mx-5 my-10 max-md:my-5">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de los proveedores
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border max-md:w-80"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
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
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm">Total en comprobantes</p>
                <p className="font-bold text-lg text-blue-500">
                  {totalAcumulado.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>{" "}
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm">Total de proveedores</p>
                <p className="font-bold text-lg text-blue-500">
                  {proveedores.length}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="mx-5 py-2 flex gap-2 items-center max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-5 max-md:bg-white max-md:px-4 max-md:py-5 max-md:h-[10vh] max-md:overflow-y-auto">
        <button
          onClick={() => openModal()}
          className="text-white bg-blue-500 py-2.5 px-6 rounded font-bold max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
        >
          Crear nuevo proveedor/ editar,etc
        </button>

        <PDFDownloadLink
          className="text-white bg-green-500 py-2.5 px-6 rounded font-bold max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
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
          className="text-white bg-rose-500 py-2.5 px-6 rounded font-bold max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
          onClick={() =>
            document.getElementById("my_modal_proveedores").showModal()
          }
        >
          Descargar lista proveedores comprobantes
        </button>
      </div>

      <div className="mt-6 w-1/3 border border-blue-500 py-3 px-3 text-sm font-semibold flex items-center justify-between bg-white mx-5 max-md:w-auto">
        <input
          className="w-full outline-none"
          type="text"
          placeholder="Buscar por proveedores existentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CgSearch className="text-blue-500" />
      </div>

      <div className="mt-6 cursor-pointer mx-5 mb-20 max-md:overflow-x-auto">
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
            {filteredProveedores.map((p) => (
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
                        : "bg-blue-50 text-blue-800"
                    } py-3 px-5 rounded`}
                  >
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </th>
                <th className="max-md:hidden">
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
                <th className="md:hidden">
                  <div className="flex">
                    <p
                      className={`${
                        p.total > 0
                          ? "bg-orange-100 text-orange-500"
                          : "bg-green-100 text-green-500"
                      } py-1 px-3 rounded`}
                    >
                      {p.total > 0 ? "Debe" : "Limpio"}
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
                      <Link
                        to={`/proveedores/${p.id}`}
                        className="hover:text-blue-500 transition-all text-left hover:underline text-xs capitalize"
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
                        className="hover:text-blue-500 transition-all text-left hover:underline text-xs"
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

      {/* <div className="mt-3 flex justify-center items-center space-x-2 pb-10">
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
      </div> */}

      <ModalCrearProveedor isOpen={isOpen} closeModal={closeModal} />
      <ModalFiltrarComprobantes />
      <ModalActualizarProveedor idObtenida={idObtenida} />
      <ModalEliminarProveedor idObtenida={idObtenida} />
    </section>
  );
};
