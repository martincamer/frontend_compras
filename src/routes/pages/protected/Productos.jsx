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
    <section className="min-h-screen max-h-full bg-gray-100/40 w-full h-full max-md:py-12">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex max-md:hidden">
        <Link
          to={"/"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/productos"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Productos
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6 max-md:my-5">
        <p className="font-bold text-blue-600 text-xl">
          Crea tus productos en esta sección y actualiza los precios.
        </p>
      </div>
      <div className="mx-5 py-1 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-5">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-blue-500/90"
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
          className="bg-orange-500 py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-orange-500/80"
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
          className="bg-green-500 py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-500/80"
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
        <div className="mt-5 mx-5 flex gap-2 max-md:flex-col">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle o el codigo...."
            className="text-sm py-2.5 px-5 bg-white text-slate-700 font-bold uppercase w-1/4  max-md:w-auto outline-none cursor-pointer border border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Selector de categoría */}
          <select
            className="text-sm py-2.5 px-5 bg-white text-slate-700 font-bold uppercase w-1/4  max-md:w-auto outline-none cursor-pointer border border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="font-bold text-blue-500" value="all">
              Todas las categorías
            </option>
            {categorias.map((c) => (
              <option className="font-semibold" key={c.id}>
                {c?.detalle}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-5 my-5 max-md:overflow-x-auto">
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
              {filteredProducts.map((p) => (
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
                  <th className="whitespace-nowrap px-4 py-4  uppercase text-xs font-bold text-blue-600">
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
                        className="dropdown-content z-[1] menu p-3 border-blue-500 border bg-white w-52 gap-2"
                      >
                        <button className="hover:text-blue-500 transition-all text-left hover:underline">
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
