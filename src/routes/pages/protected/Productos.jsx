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
  const [productsPerPage] = useState(10);

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        {/* Placeholder para el primer artículo */}
        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-slate-300 p-3 text-slate-700 animate-pulse py-8 px-8"></span>
            <div>
              <div
                className="bg-gray-200 h-8 w-20 animate-pulse
              "
              ></div>
              <div className="bg-gray-200 h-5 w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-slate-300 p-2 text-slate-100 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 animate-pulse"></div>
          </div>
        </article>

        {/* Placeholder para el segundo artículo */}
        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-slate-300 p-3 text-slate-700 animate-pulse py-8 px-8"></span>
            <div>
              <div
                className="bg-gray-200 h-8 w-20 animate-pulse
              "
              ></div>
              <div className="bg-gray-200 h-5 w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-xl bg-slate-300 p-2 text-slate-100 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-200 animate-pulse"></div>
          </div>
        </article>
      </div>

      {/* Placeholder para los botones */}
      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button className="bg-white border-slate-300 border-[1px] py-5 px-40 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs animate-pulse"></button>
        <button className="bg-white border-slate-300 border-[1px] py-5 px-40 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs animate-pulse"></button>
      </div>

      {/* Placeholder para la tabla de productos */}
      <div className="max-md:mt-2 mt-5 ">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-indigo-600 font-semibold text-sm underline animate-pulse"></p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          {/* Placeholder para el buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle"
            className="rounded-xl py-2 px-5 border-slate-300 bg-white text-slate-700 border-[1px] uppercase animate-pulse w-1/4"
          />
          {/* Placeholder para el selector de categoría */}
          <select className="py-1 px-32 text-slate-700 rounded-xl shadow bg-white border-slate-300 border-[1px] uppercase animate-pulse"></select>
        </div>

        {/* Placeholder para la tabla de productos */}
        <div className="overflow-x-auto mt-6 mx-8 border-slate-300 border-[1px] rounded-2xl animate-pulse">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300 uppercase font-normal"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300 uppercase font-normal"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300 uppercase font-normal"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300 uppercase font-normal"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300 uppercase font-normal"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* Placeholder para 10 filas de datos */}
              {[...Array(productos.length)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-8 font-medium text-gray-900 uppercase text-sm animate-pulse bg-slate-100/20">
                    {/* Placeholder para el código */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-8 text-gray-700 uppercase text-sm animate-pulse bg-slate-100/20">
                    {/* Placeholder para el detalle */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-8 text-gray-700 uppercase text-sm animate-pulse bg-slate-100/20">
                    {/* Placeholder para la categoría */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-8  uppercase text-sm font-bold text-indigo-500 animate-pulse bg-slate-100/20">
                    {/* Placeholder para el precio */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-8 text-gray-700 uppercase text-sm cursor-pointer space-x-2 animate-pulse bg-slate-100/20">
                    {/* Placeholder para las acciones */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-indigo-100 p-3 text-indigo-700">
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
              <p className="text-2xl font-medium text-indigo-700">
                {Number(productos.length)}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Productos cargados hasta el momento
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-indigo-100 p-2 text-indigo-600">
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
              {Number(productos.length / 1).toFixed(2)} %{" "}
            </span>
          </div>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
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
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-indigo-100 py-2 px-4 rounded-xl text-sm text-indigo-700 uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-indigo-200"
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
          className="bg-green-100 py-2 px-4 rounded-xl text-sm text-green-800 uppercase max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-300"
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
      </div>

      <div className="max-md:mt-2 mt-5 ">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-indigo-600 font-semibold text-sm underline">
            Tabla de productos
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por detalle"
            className="rounded-xl py-2 px-5 border-slate-300 bg-white text-slate-700 border-[1px] uppercase w-1/4"
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

        <div className="overflow-x-auto mt-6 mx-8 border-slate-300 border-[1px]  rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-500 uppercase font-normal">
                  Codigo
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-500 uppercase font-normal">
                  Detalle
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-500 uppercase font-normal">
                  Categoria
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-500 uppercase font-normal">
                  Precio Und
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-500 uppercase font-normal">
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
                  <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-indigo-500">
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
