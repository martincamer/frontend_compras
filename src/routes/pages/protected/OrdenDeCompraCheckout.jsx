import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import { Link } from "react-router-dom";
import { ModalVerProductos } from "../../../components/Modales/ModalVerProductos";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
  const [productsPerPage] = useState(10);

  // Filtrar las órdenes según el término de búsqueda y la categoría seleccionada
  const filteredProducts = ordenesMensuales.filter((orden) => {
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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages);
    const startPage = Math.max(1, maxPages - 4);
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

  return (
    <section className="bg-gray-100/50 min-h-screen max-h-full w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />

      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="rounded flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
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

        <article className="rounded flex items-start justify-between gap-4 shadow-xl hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
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
        <article className="rounded flex items-center gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer bg-white py-4 px-6">
          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase">
              Materiales/categorias gastos totales
            </strong>

            <p className="mt-2 h-[40px] overflow-y-scroll w-full scroll-bar">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base w-full">
                <ul className="flex flex-col gap-1 w-full">
                  {categoryTotalsData.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600 w-full"
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
      </div>

      <div className="max-md:mt-2 mt-4 px-6">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-sky-400 font-semibold text-sm underline">
            Ordenes de compra finalizadas/os checkouts
          </p>
        </div>

        <div className="mt-5 px-8 flex gap-2">
          <input
            type="text"
            placeholder="BUSCAR POR EL PROVEEDOR O DETALLE.."
            className="w-1/4 rounded-xl py-2 px-5 shadow-lg font-bold bg-white text-slate-700 uppercase outline-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white  rounded-2xl shadow-xl transition-all ease-linear mt-6 mx-5">
        <table className="min-w-full text-sm cursor-pointer table">
          <thead className="text-left text-sm">
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
              <tr className="hover:bg-gray-100/50 transition-all" key={p.id}>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm font-bold">
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
                        <Link
                          to={`/orden-checkout/${p.id}`}
                          className="bg-sky-500/20 hover:bg-sky-200 text-sky-700 py-2 px-3 rounded-xl text-sm flex gap-1 items-center"
                        >
                          VER ORDEN CHECKOUT
                        </Link>
                      </li>
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
                    </ul>
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer">
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

      <ModalVerProductos
        isOpen={isProductos}
        closeModal={closeProductos}
        obtenerId={obtenerId}
      />
    </section>
  );
};
