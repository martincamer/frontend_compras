import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ModalCrearOrden } from "../../../components/Modales/ModalCrearOrden";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import { Link } from "react-router-dom";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";

export const OrdenDeCompra = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const [isOpenEliminar, setIsOpenEliminar] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeEliminar = () => {
    setIsOpenEliminar(false);
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const filteredProducts = ordenesMensuales.filter((orden) => {
    // Verificar si el proveedor, el detalle del producto y la categoría coinciden con los criterios de búsqueda
    return (
      (orden.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.datos.productoSeleccionado.some((producto) =>
          producto.detalle.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (selectedCategory === "all" ||
        orden.datos.productoSeleccionado.some(
          (producto) => producto.categoria === selectedCategory
        ))
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

  const precioTotal = ordenesMensuales.reduce(
    (total, orden) => total + Number(orden.precio_final),
    0
  );

  console.log(ordenesMensuales);

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

  console.log(categoryTotalsData);

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
        {/* Placeholder para el enlace */}
        <button className="bg-slate-200  py-5 px-20 rounded-xl"></button>
        {/* Placeholder para el enlace */}
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
        <div className="mt-8 grid grid-cols-3 gap-5">
          {[...Array(ordenesMensuales.length)].map((_, index) => (
            <div className="border-slate-200 border-[1px] w-full h-[20vh] rounded-2xl shadow flex gap-6 py-6 px-6">
              <div className="h-full w-full bg-slate-200 py-2 px-2 rounded-2xl"></div>
              <div className="h-full w-full bg-slate-200 py-2 px-2 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-md cursor-pointer transition-all ease-linear">
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

        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-md cursor-pointer transition-all ease-linear">
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
        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-md cursor-pointer transition-all ease-linear">
          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase">
              Materiales/categorias gastos totales
            </strong>

            <p className="mt-2 h-[35px] overflow-y-scroll">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                <ul className="flex flex-col gap-1">
                  {categoryTotalsData.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600"
                      key={category.category}
                    >
                      <span className="font-bold">{category.category}:</span>{" "}
                      <span className="text-red-600">
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
          className="bg-green-200  py-2 px-4 rounded-xl text-sm text-green-700 uppercase max-md:text-xs flex gap-2 items-center hover:bg-green-500 hover:text-white transition-all ease-in-out"
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
          className="flex items-center gap-1 bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs"
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
          className="flex items-center gap-1 bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs"
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
          <p className="uppercase text-indigo-500 font-semibold text-sm underline">
            Ordenes de compra
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          <input
            type="text"
            placeholder="BUSCAR POR EL PROVEEDOR O DETALLE.."
            className="w-1/4 rounded-xl py-2 px-5 border-slate-300 bg-white text-slate-700 border-[1px] uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
      </div>
      <div className="py-3 px-4 rounded-xl mx-8 mt-2">
        <div className="grid grid-cols-3 h-full w-full gap-4">
          {currentProducts.map((o) => (
            <div
              className="hover:shadow-md transition-all ease-linear cursor-pointer border-slate-200 border-[1px] rounded-xl pt-14 pb-6 px-5 flex justify-between items-center relative"
              key={o.id}
            >
              <div className="absolute top-2 right-5 flex items-center gap-2">
                <Link
                  to={`/orden/${o.id}`}
                  className="py-2 px-4 rounded-xl text-indigo-500 text-xs bg-indigo-100 cursor-pointer flex items-center gap-1"
                >
                  VER ORDEN
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Link>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600 bg-blue-100 p-1 rounded-xl cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg> */}
                <svg
                  onClick={() => {
                    handleID(o.id), openEliminar();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-600 bg-red-100 p-1 rounded-xl cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <article>
                <p className="uppercase flex gap-1">
                  <span className="font-semibold text-sm text-indigo-500 underline">
                    Numero
                  </span>
                  <span className="text-normal text-sm text-slate-700">
                    {o.id}
                  </span>
                </p>
                <p className="uppercase flex gap-1">
                  <span className="font-semibold text-sm text-indigo-500 underline">
                    Proveedor
                  </span>
                  <span className="text-normal text-sm text-slate-700">
                    {o.proveedor}
                  </span>
                </p>

                <p className="uppercase flex gap-1">
                  <span className="font-semibold text-sm text-indigo-500 underline">
                    Numero Remito/Factura
                  </span>
                  <span className="text-normal text-sm text-slate-700">
                    N° {o.numero_factura}
                  </span>
                </p>
                <p className="uppercase flex gap-1">
                  <span className="font-semibold text-sm text-indigo-500 underline">
                    Fecha factura/remito
                  </span>
                  <span className="text-normal text-sm text-slate-700">
                    {new Date(o.fecha_factura).toLocaleDateString("es-ES")}
                  </span>
                </p>
                <p className="uppercase flex gap-1">
                  <span className="font-semibold text-sm text-indigo-500 underline">
                    Total Facturado
                  </span>
                  <span className="text-normal text-sm text-red-600">
                    -{" "}
                    {Number(o.precio_final).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </p>
              </article>
              <article>
                <p className="text-slate-800 uppercase font-semibold text-sm underline">
                  PRODUCTOS
                </p>
                <div className="h-[100px] overflow-y-scroll mt-2">
                  <div className="flex flex-col gap-2">
                    {o.datos.productoSeleccionado.map((producto) => (
                      <div
                        className="bg-white border-slate-200 border-[1px] py-1 px-2 rounded-xl"
                        key={producto.id}
                      >
                        <p className="text-xs uppercase">
                          <span className="font-bold text-slate-700">
                            Detalle:
                          </span>{" "}
                          <span className="text-slate-600">
                            {" "}
                            {producto.detalle}
                          </span>
                        </p>
                        <p className="text-xs uppercase">
                          <span className="font-bold text-slate-700">
                            Categoria:
                          </span>{" "}
                          <span className="text-slate-600">
                            {" "}
                            {producto.categoria}
                          </span>
                        </p>

                        <p className="text-xs uppercase">
                          <span className="font-bold text-slate-700">
                            Precio unitario:{" "}
                          </span>{" "}
                          <span className="text-slate-600">
                            {Number(producto.precio_und).toLocaleString(
                              "es-AR",
                              { style: "currency", currency: "ARS" }
                            )}
                          </span>
                        </p>
                        <p className="text-xs uppercase">
                          <span className="font-bold text-slate-700">
                            Cantidad:
                          </span>{" "}
                          <span className="text-slate-600">
                            {" "}
                            {producto.cantidad}
                          </span>
                        </p>
                        <p className="text-xs uppercase">
                          <span className="font-bold text-slate-700">
                            Total:
                          </span>{" "}
                          <span className="text-slate-900">
                            {Number(producto.totalFinal).toLocaleString(
                              "es-AR",
                              { style: "currency", currency: "ARS" }
                            )}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
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

      <ModalCrearOrden isOpen={isOpen} closeModal={closeModal} />
      <ModalEliminar
        eliminarModal={isOpenEliminar}
        closeEliminar={closeEliminar}
        obtenerId={obtenerId}
      />
    </section>
  );
};
