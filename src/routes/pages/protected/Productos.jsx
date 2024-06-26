import { useEffect, useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProductos } from "../../../components/Modales/ModalCrearProductos";
import { ModalCrearCategorias } from "../../../components/Modales/ModalCrearCategorias";
import { ToastContainer } from "react-toastify";
import { ModalEditarProducto } from "../../../components/Modales/ModalEditarProducto";
import { ModalEliminarProducto } from "../../../components/Modales/ModalEliminarProducto";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Link } from "react-router-dom";
import { ListaDePrecios } from "../../../components/pdf/ListaDePrecios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const Productos = () => {
  const { productos, categorias } = useProductosContext();

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

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isOpenCategorias, setIsOpenCategorias] = useState(false);

  const openModalCategorias = () => {
    setIsOpenCategorias(true);
  };

  const closeModalCategorias = () => {
    setIsOpenCategorias(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  // Obtener índices de paginación para productos filtrados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const [editarProducto, setEditarProducto] = useState(false);

  const [OBTENERID, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  const openEditProducto = () => {
    setEditarProducto(true);
  };

  const closeEditProducto = () => {
    setEditarProducto(false);
  };

  const [isOpenEliminar, setIsEliminar] = useState(false);

  const openEliminar = () => {
    setIsEliminar(true);
  };

  const closeEliminar = () => {
    setIsEliminar(false);
  };

  return (
    <section className="min-h-screen max-h-full bg-gray-100/40 w-full h-full">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-sky-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/productos"}
          className="bg-sky-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Productos
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-sky-600 text-xl">
          Crea tus productos en esta sección y actualiza los precios.
        </p>
      </div>
      <div className="mx-5 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-sky-400 py-3 px-6 rounded text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-sky-500/90"
        >
          Crear nuevo producto
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button
          className="bg-orange-500/90 py-3 px-6 rounded text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-orange-500/80"
          onClick={() => openModalCategorias()}
        >
          Crear nuevas categorias/editar/etc
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
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <PDFDownloadLink
          className="bg-green-500/90 py-3 px-6 rounded text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-500/80"
          document={<ListaDePrecios datos={productos} />}
        >
          Descargar lista de precios
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

      <div className="max-md:mt-2 mt-5 ">
        {/* <div className="max-md:px-2 bg-white py-4 px-3 mx-5">
          <p className="uppercase text-sky-500 font-semibold text-sm underline">
            Tabla de productos
          </p>
        </div> */}

        <div className="mt-5 mx-5 flex gap-2">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle o el codigo...."
            className="text-sm py-2.5 px-5 bg-white text-slate-700 font-bold uppercase w-1/4 outline-none cursor-pointer border border-sky-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Selector de categoría */}
          <select
            className="text-sm py-2.5 px-5 bg-white text-slate-700 font-bold uppercase w-1/4 outline-none cursor-pointer border border-sky-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="font-bold text-sky-500" value="all">
              Todas las categorías
            </option>
            {categorias.map((c) => (
              <option className="font-semibold" key={c.id}>
                {c?.detalle}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-5 my-5">
          <table className="min-w-full divide-y-2 table text-xs rounded-none bg-white">
            <thead className="text-left">
              <tr className="">
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-xs">
                  Codigo
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-xs">
                  Detalle
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-xs">
                  Categoria
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-xs">
                  Precio Und
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-xs">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((p) => (
                <tr key={p.id}>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900 uppercase text-xs">
                    {p.id}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs">
                    {p.detalle}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs">
                    {p.categoria}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4  uppercase text-xs font-bold text-sky-600">
                    {Number(p.precio_und).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs cursor-pointer space-x-2">
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
                        <button className="hover:text-sky-500 transition-all text-left hover:underline">
                          <span
                            onClick={() => {
                              handleID(p.id), openEditProducto();
                            }}
                          >
                            Editar producto
                          </span>
                        </button>
                        <button className="hover:text-red-500 transition-all text-left hover:underline">
                          <span
                            onClick={() => {
                              handleID(p.id), openEliminar();
                            }}
                          >
                            Eliminar producto
                          </span>
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

      <ModalCrearProductos isOpen={isOpen} closeModal={closeModal} />
      <ModalCrearCategorias
        isOpenCategorias={isOpenCategorias}
        closeModalCategorias={closeModalCategorias}
      />
      <ModalEditarProducto
        isOpen={editarProducto}
        closeModal={closeEditProducto}
        OBTENERID={OBTENERID}
      />

      <ModalEliminarProducto
        obtenerId={OBTENERID}
        closeEliminar={closeEliminar}
        eliminarModal={isOpenEliminar}
      />
    </section>
  );
};
