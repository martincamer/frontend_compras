import { useEffect, useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProductos } from "../../../components/Modales/ModalCrearProductos";
import { ModalCrearCategorias } from "../../../components/Modales/ModalCrearCategorias";
import { ToastContainer } from "react-toastify";
import { ModalEditarProducto } from "../../../components/Modales/ModalEditarProducto";
import { ModalEliminarProducto } from "../../../components/Modales/ModalEliminarProducto";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprirmirProductosPDF } from "../../../components/pdf/ImprirmirProductosPDF";
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredProducts = currentProducts.filter((product) => {
    const searchTermMatches = product.detalle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  const totalPages = Math.ceil(productos.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  // const [currentPage, setCurrentPage] = useState(1);
  // const [productsPerPage] = useState(10);

  // const filteredProducts = productos.filter((product) => {
  //   const idMatches = product.id.toString().includes(searchTerm.toLowerCase());
  //   const detailMatches = product.detalle
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const categoryMatches =
  //     selectedCategory === "all" || product.categoria === selectedCategory;

  //   // Filtra si coincide con el ID o con el detalle, además de la categoría
  //   return (idMatches || detailMatches) && categoryMatches;
  // });

  // // Lógica de paginación
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  // // Cambiar de página
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen max-h-full bg-gray-100/40 w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
          <div className="flex justify-center h-full gap-4 items-center">
            <span className="rounded-full bg-sky-400 p-3 text-white">
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
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-sky-500">
                {Number(productos.length)}
              </p>

              <p className="text-sm font-semibold text-gray-500 uppercase underline">
                Productos cargados hasta el momento
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-sky-400 p-2 text-white">
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
              {Number(productos.length % 100).toFixed(2)} %{" "}
            </span>
          </div>
        </article>
        <article className="flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
          <div className="flex justify-center h-full gap-4 items-center py-8">
            <span className="rounded-full bg-green-500/80 p-3 text-white">
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

          <div className="inline-flex gap-2 rounded-xl bg-green-500/80 py-2 px-4 text-white">
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
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-sky-400 py-3 px-6 rounded-full text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-sky-500/90"
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
          className="bg-green-500/90 py-3 px-6 rounded-full text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-500/80"
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
          className="bg-green-500/90 py-3 px-6 rounded-full text-sm text-white font-medium uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-500/80"
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
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-sky-500 font-semibold text-sm underline">
            Tabla de productos
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle o el codigo...."
            className="text-sm rounded-xl py-2.5 px-5  shadow-lg bg-white text-slate-700 font-bold uppercase w-1/4 outline-sky-500 cursor-pointer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Selector de categoría */}
          <select
            className="font-semibold text-sm py-1 px-4 text-slate-700 rounded-xl shadow-lg bg-white uppercase outline-sky-500 cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categorias.map((c) => (
              <option>{c?.detalle}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 mx-8 bg-white shadow-xl rounded-2xl transition-all ease-linear cursor-pointer">
          <table className="min-w-full divide-y-2 table text-sm">
            <thead className="text-left">
              <tr className="">
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-sm">
                  Codigo
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-sm">
                  Detalle
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-sm">
                  Categoria
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-sm">
                  Precio Und
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-500 uppercase font-bold text-sm">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900 uppercase text-sm">
                    {p.id}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                    {p.detalle}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                    {p.categoria}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4  uppercase text-sm font-semibold text-sky-600">
                    {Number(p.precio_und).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer space-x-2">
                    <div className="dropdown dropdown-left z-1">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-slate-100 rounded-full px-2 py-2 transition-all"
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
                            className="bg-sky-500/10 text-sky-800 hover:bg-sky-200 py-2 px-3 rounded-xl text-sm"
                            onClick={() => {
                              handleID(p.id), openEditProducto();
                            }}
                          >
                            EDITAR
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={() => {
                              handleID(p.id), openEliminar();
                            }}
                            className="bg-red-500/10 text-red-800 hover:bg-red-200 py-2 px-3 rounded-xl text-sm"
                          >
                            ELIMINAR
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
      {/* <div className="flex justify-center mt-4">
        {filteredProducts.length > productsPerPage && (
          <nav className="pagination">
            <ul className="pagination-list flex gap-2">
              {Array.from({
                length: Math.ceil(filteredProducts.length / productsPerPage),
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
      </div> */}
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
