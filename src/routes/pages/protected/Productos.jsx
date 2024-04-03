import { useEffect, useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProductos } from "../../../components/Modales/ModalCrearProductos";
import { ModalCrearCategorias } from "../../../components/Modales/ModalCrearCategorias";
import { ToastContainer } from "react-toastify";
import { ModalEditarProducto } from "../../../components/Modales/ModalEditarProducto";
import { ModalEliminarProducto } from "../../../components/Modales/ModalEliminarProducto";

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
  const [productsPerPage] = useState(5);

  // Filtrar productos por término de búsqueda y categoría seleccionada
  const filteredProducts = productos.filter((product) => {
    return (
      product?.detalle?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
      (selectedCategory === "all" || product.categoria === selectedCategory)
    );
  });

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col items-start justify-center gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          {/* <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium max-md:text-xs uppercase">
              {" "}
            </span>
          </div> */}

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total productos cargados
            </strong>

            <p>
              <span className="text-2xl font-medium text-green-600 max-md:text-base uppercase">
                {productos.length}{" "}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                total cargados {"  "}
                <span className="font-bold text-slate-700 uppercase">
                  {productos.length}
                </span>
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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
              {nombreMesActual}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl max-md:text-base font-medium text-gray-900 uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs"
        >
          Crear nuevo producto
        </button>
        <button
          className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs"
          onClick={() => openModalCategorias()}
        >
          Crear nuevas categorias/editar/etc
        </button>
      </div>

      <div className="max-md:mt-2 mt-5 ">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-orange-500 font-semibold text-sm underline">
            Tabla de productos
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle"
            className="rounded-xl py-2 px-5 border-slate-300 bg-white text-slate-700 border-[1px] uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Selector de categoría */}
          <select
            className="py-1 px-4 text-slate-700 rounded-xl shadow bg-white border-slate-300 border-[1px] uppercase"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categorias.map((c) => (
              <option>{c?.detalle}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto mt-6 mx-8">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-gray-900 uppercase font-semibold">
                  Codigo
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-gray-900 uppercase font-semibold">
                  Detalle
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-gray-900 uppercase font-semibold">
                  Categoria
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-gray-900 uppercase font-semibold">
                  Precio Und
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-gray-900 uppercase font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 uppercase text-sm">
                    {p.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                    {p.detalle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                    {p.categoria}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-green-500">
                    {Number(p.precio_und).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer space-x-2">
                    <span
                      onClick={() => {
                        handleID(p.id), openEditProducto();
                      }}
                      className="bg-green-500/20 text-green-600 py-2 px-3 rounded-xl text-sm"
                    >
                      EDITAR
                    </span>
                    <span
                      onClick={() => {
                        handleID(p.id), openEliminar();
                      }}
                      className="bg-red-500/10 text-red-800 py-2 px-3 rounded-xl text-sm"
                    >
                      ELIMINAR
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
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
