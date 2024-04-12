import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ModalCrearProveedor } from "../../../components/Modales/ModalCrearProveedor";
import { Link } from "react-router-dom";

export const Proveedores = () => {
  const { proveedores } = useProductosContext();

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = proveedores?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const precioTotal = proveedores.reduce(
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

  return isLoading ? (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      {/* ToastContainer */}
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0 animate-pulse">
        {/* Primer artículo */}
        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 shadow">
          {/* Icono y detalles */}
          <div className="flex gap-4 items-center">
            {/* Placeholder para el icono */}
            <div className="rounded-full bg-slate-200 p-3 text-slate-700">
              <div className="w-9 h-9 rounded-full bg-gray-300"></div>
            </div>
            <div className="space-y-2">
              {/* Placeholder para el texto */}
              <p className="text-2xl font-medium bg-slate-200 py-4 px-16 rounded-xl"></p>
              <p className="text-sm bg-slate-200 uppercase underline py-4 px-16 rounded-xl"></p>
            </div>
          </div>
          {/* Placeholder para el porcentaje */}
          <div className="inline-flex gap-2 rounded-xl bg-slate-200 py-4 px-10"></div>
        </article>
        {/* Segundo artículo */}
        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 shadow">
          {/* Icono y detalles */}
          <div className="flex gap-4 items-center">
            {/* Placeholder para el icono */}
            <div className="rounded-full bg-slate-200 p-3 text-slate-700">
              <div className="w-9 h-9 rounded-full bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              {/* Placeholder para el texto */}
              <p className="text-2xl font-medium bg-slate-200 py-4 px-16 rounded-xl"></p>
              <p className="text-sm bg-slate-200 uppercase underline py-4 px-16 rounded-xl"></p>
            </div>
          </div>
          {/* Placeholder para el porcentaje */}
          <div className="inline-flex gap-2 rounded-xl bg-slate-200 py-4 px-10"></div>
        </article>

        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 shadow">
          {/* Icono y detalles */}
          <div className="flex gap-4 items-center">
            {/* Placeholder para el icono */}
            <div className="rounded-full bg-slate-200 p-3 text-slate-700">
              <div className="w-9 h-9 rounded-full bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              {/* Placeholder para el texto */}
              <p className="text-2xl font-medium bg-slate-200 py-4 px-16 rounded-xl"></p>
              <p className="text-sm bg-slate-200 uppercase underline py-4 px-16 rounded-xl"></p>
            </div>
          </div>
          {/* Placeholder para el porcentaje */}
          <div className="inline-flex gap-2 rounded-xl bg-slate-200 py-4 px-10"></div>
        </article>
        {/* Tercer artículo */}
      </div>
      {/* Botones */}
      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-200 pb-4 max-md:pb-4 max-md:mx-2 animate-pulse">
        {/* Placeholder para el botón */}
        <button className="bg-slate-200  py-5 px-20 rounded-xl"></button>
      </div>
      {/* Placeholder para la sección de órdenes de compra */}
      <div className="max-md:mt-2 mt-4 px-6 animate-pulse">
        {/* Placeholder para el título */}
        <div className="px-10 max-md:px-2">
          <button className="bg-slate-200  py-5 px-20 rounded-xl"></button>
        </div>
        {/* Placeholder para la barra de búsqueda */}
        <div className="mt-5 px-8 flex gap-2">
          {/* Placeholder para el campo de búsqueda */}
          <div className="w-1/4 rounded-xl py-2 px-5 border-slate-200 bg-white text-slate-700 border-[1px] uppercase"></div>
          {/* Placeholder para el select */}
          <div className="py-5 px-32 text-slate-700 rounded-xl shadow bg-white border-slate-200 border-[1px] uppercase"></div>
        </div>
        {/* Placeholder para las órdenes de compra */}
        <div className="overflow-x-auto mt-6 mx-6 border-slate-300 border-[1px] rounded-2xl animate-pulse">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300"></th>
                <th className="whitespace-nowrap px-4 py-7 bg-slate-300"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 ">
              {/* Placeholder para 10 filas de datos */}
              {[...Array(proveedores.length)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-10 font-medium text-gray-900 uppercase text-sm animate-pulse">
                    {/* Placeholder para el código */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-10 text-gray-700 uppercase text-sm animate-pulse">
                    {/* Placeholder para el detalle */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-10 text-gray-700 uppercase text-sm animate-pulse">
                    {/* Placeholder para la categoría */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-10  uppercase text-sm font-bold text-indigo-500 animate-pulse">
                    {/* Placeholder para el precio */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-10 text-gray-700 uppercase text-sm cursor-pointer space-x-2 animate-pulse">
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
              {Number(proveedores.length / 1).toFixed(2)} %{" "}
            </span>
          </div>
        </article>
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-indigo-100 py-2 px-4 rounded-xl text-sm text-indigo-700 uppercase max-md:text-xs flex gap-2 items-center hover:bg-indigo-500 hover:text-white transition-all ease-linear"
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
      </div>

      <div className="mx-8 mt-6">
        <p className="underline text-indigo-500 uppercase font-semibold">
          Proveedores tabla de saldos
        </p>
      </div>

      <div className="overflow-x-auto mt-6 mx-8 rounded-2xl border-slate-300 border-[1px] transition-all hover:shadow-md ease-linear cursor-pointer">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Proveedor
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
              <tr key={p.id}>
                <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                  {p.proveedor}
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
        {proveedores.length > productsPerPage && (
          <nav className="pagination">
            <ul className="pagination-list flex gap-2">
              {Array.from({
                length: Math.ceil(proveedores.length / productsPerPage),
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
  );
};
