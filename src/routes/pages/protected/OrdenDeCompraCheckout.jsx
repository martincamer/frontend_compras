import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import { Link } from "react-router-dom";
import { ModalVerProductos } from "../../../components/Modales/ModalVerProductos";

export const OrdenDeCompraCheckout = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const { ordenesMensuales } = useOrdenesContext();
  const { categorias } = useProductosContext();

  const [isProductos, setIsProductos] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  const openProductos = () => {
    setIsProductos(true);
  };

  const closeProductos = () => {
    setIsProductos(false);
  };

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

  // Ordenar por fecha de creación descendente
  filteredProducts.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Mover las órdenes pendientes al principio
  const pendingOrders = filteredProducts.filter((order) =>
    order.datos.productoSeleccionado.some(
      (producto) =>
        parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
    )
  );
  const completedOrders = filteredProducts.filter(
    (order) =>
      !order.datos.productoSeleccionado.some(
        (producto) =>
          parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
      )
  );
  const sortedProducts = [...pendingOrders, ...completedOrders];

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const precioTotal = currentProducts.reduce(
    (total, orden) => total + Number(orden.precio_final),
    0
  );

  // Function to calculate category totals
  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterate through invoices
    currentProducts.forEach((invoice) => {
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

  // Suma de las cantidades de todos los productos
  const cantidadTotal = ordenesMensuales.reduce((acc, orden) => {
    const productos = orden.datos.productoSeleccionado;
    const cantidadOrden = productos.reduce(
      (total, producto) => total + parseInt(producto.cantidad),
      0
    );
    return acc + cantidadOrden;
  }, 0);

  // Suma de las cantidades faltantes de todos los productos
  const cantidadFaltanteTotal = ordenesMensuales.reduce((acc, orden) => {
    const productos = orden.datos.productoSeleccionado;
    const cantidadFaltanteOrden = productos.reduce(
      (total, producto) => total + parseInt(producto.cantidadFaltante),
      0
    );
    return acc + cantidadFaltanteOrden;
  }, 0);

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
          <div className="inline-flex gap-2 rounded-xl bg-slate-300 py-4 px-10"></div>
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
        {/* <div className="mt-8 grid grid-cols-3 gap-5">
          {[...Array(ordenesMensuales.length)].map((_, index) => (
            <div className="border-slate-200 border-[1px] w-full h-[20vh] rounded-2xl shadow flex gap-6 py-6 px-6">
              <div className="h-full w-full bg-slate-200 py-2 px-2 rounded-2xl"></div>
              <div className="h-full w-full bg-slate-200 py-2 px-2 rounded-2xl"></div>
            </div>
          ))}
        </div> */}
        <div className="overflow-x-auto mt-6 mx-0 border-slate-300 border-[1px] rounded-2xl animate-pulse">
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

            <tbody className="divide-y divide-gray-200">
              {/* Placeholder para 10 filas de datos */}
              {[...Array(ordenesMensuales.length)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-8 font-medium text-gray-900 uppercase text-sm animate-pulse">
                    {/* Placeholder para el código */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-8 text-gray-700 uppercase text-sm animate-pulse">
                    {/* Placeholder para el detalle */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-8 text-gray-700 uppercase text-sm animate-pulse">
                    {/* Placeholder para la categoría */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-8  uppercase text-sm font-bold text-indigo-500 animate-pulse">
                    {/* Placeholder para el precio */}
                  </td>
                  <td className="whitespace-nowrap px-4 bg-slate-100/30 py-8 text-gray-700 uppercase text-sm cursor-pointer space-x-2 animate-pulse">
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
        <Link
          to={"/registro-ordenes-checkout"}
          className="hover:bg-indigo-500 hover:text-white transition-all ease-linear flex items-center gap-1 bg-indigo-100 py-2 px-4 rounded-xl text-sm text-indigo-500 uppercase max-md:text-xs"
        >
          Ver registros de ordenes finalizadas
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
            Ordenes de compra finalizadas/os checkouts
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

      <div className="border-[1px] border-slate-300 rounded-2xl hover:shadow-md transition-all ease-linear mt-6 mx-5">
        <table className="min-w-full divide-y-2 divide-gray-200 text-sm cursor-pointer">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Numero
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Proveedor
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Numero Factura
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Fecha de la factura
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Total Facturado
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Acciones
              </th>

              <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                Estado de la orden
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                  {p.id}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                  {p.proveedor}
                </td>
                <td className="whitespace-nowrap px-4 py-4  uppercase text-sm">
                  N° {p.numero_factura}
                </td>
                <td className="whitespace-nowrap px-4 py-4  uppercase text-sm">
                  {new Date(p.fecha_factura).toLocaleDateString("ars")}
                </td>
                <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-indigo-500">
                  {Number(p.precio_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer space-x-2 flex">
                  <span
                    onClick={() => {
                      handleID(p.id), openProductos();
                    }}
                    className="bg-orange-500/20 text-orange-600 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
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

                  <Link
                    to={`/orden-checkout/${p.id}`}
                    className="bg-indigo-500/20 text-indigo-700 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
                  >
                    VER ORDEN CHECKOUT
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
                        uu
                      />
                    </svg>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer">
                  <div className="flex">
                    <Link
                      key={p.id}
                      className={`${
                        p.datos.productoSeleccionado.every(
                          (producto) =>
                            parseInt(producto.cantidad) ===
                            parseInt(producto.cantidadFaltante)
                        )
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100  text-orange-700"
                      } py-3 px-6 font-bold rounded-xl text-sm cursor-pointer flex items-center gap-1`}
                    >
                      {p.datos.productoSeleccionado.every(
                        (producto) =>
                          parseInt(producto.cantidad) ===
                          parseInt(producto.cantidadFaltante)
                      ) ? (
                        <>
                          FINALIZADO
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
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          PENDIENTE
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
                              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </>
                      )}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      <ModalVerProductos
        isOpen={isProductos}
        closeModal={closeProductos}
        obtenerId={obtenerId}
      />
    </section>
  );
};
