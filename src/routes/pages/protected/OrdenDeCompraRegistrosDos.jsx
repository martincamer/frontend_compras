import { useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Link } from "react-router-dom";
import client from "../../../api/axios";

export const OrdenDeCompraRegistrosDos = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const { categorias } = useProductosContext();

  const [ordenesBuscadas, setOrdenesBuscadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerOrdenesRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/ordenes-rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setOrdenesBuscadas(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener salidas:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerOrdenesRangoFechas(fechaInicio, fechaFin);
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

  const filteredProducts = ordenesBuscadas.filter((orden) => {
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

  const precioTotal = filteredProducts.reduce(
    (total, orden) => total + Number(orden.precio_final),
    0
  );

  // Function to calculate category totals
  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterate through invoices
    ordenesBuscadas.forEach((invoice) => {
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

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-20 max-md:gap-5">
      <ToastContainer />
      <nav aria-label="Breadcrumb" className="flex px-5">
        <ol className="flex overflow-hidden rounded-xl border bg-slate-300 text-gray-600 shadow">
          <li className="flex items-center">
            <Link
              to={"/"}
              className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <span className="ms-1.5 text-xs font-medium"> INICIO </span>
            </Link>
          </li>

          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>

            <Link
              to={"/ordenes-checkout"}
              href="#"
              className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
            >
              ORDENES CHECKOUT
            </Link>
          </li>
        </ol>
      </nav>
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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

            <span className="text-xs font-medium max-md:text-xs">
              {Number(precioTotal / 100000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en compras del mes finalizadas/pendientes
            </strong>

            <p>
              <span className="text-xl font-medium text-red-600 max-md:text-base">
                -{" "}
                {Number(precioTotal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                gastado en compras{" "}
                <span className="font-bold text-slate-700">
                  {Number(precioTotal).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
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
              <span className="text-xl max-md:text-base font-medium text-gray-900 uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> </span>
          </div> */}

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm uppercase">
              Materiales/categorias gastos totales
            </strong>

            <p className="mt-2 h-[55px] overflow-y-scroll">
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

      <div className="mx-6">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start">
          <div className="flex gap-2 items-center">
            <label className="text-base uppercase text-slate-700">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-xl shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-base uppercase text-slate-700">
              Fecha fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-xl shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <button
              onClick={buscarIngresosPorFecha}
              className="bg-white border-slate-300 border-[1px] rounded-xl px-2 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-md:mt-2 mt-4 px-6">
        <div className="px-10 max-md:px-2">
          <p className="uppercase text-orange-500 font-semibold text-sm underline">
            Ordenes de compra registradas del mes
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
        {loading ? (
          <div className="flex justify-center items-center col-span-3 border-slate-300 border-[1px] shadow py-12 px-6 rounded-xl">
            <SyncLoader color={"#4a90e2"} loading={loading} size={6} />
            <p className="text-gray-700 ml-2 uppercase">Cargando datos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 h-full w-full gap-4">
            {currentProducts.map((o) => (
              <div
                className="shadow border-slate-200 border-[1px] rounded-xl pt-14 pb-6 px-5 flex justify-between items-center relative"
                key={o.id}
              >
                <div className="absolute top-2 right-5 flex items-center gap-2">
                  <Link
                    target="_blank"
                    to={`/orden-checkout/${o.id}`}
                    className="py-2 px-4 rounded-xl text-white text-xs bg-black cursor-pointer flex items-center gap-1"
                  >
                    VER ORDEN CHECKOUT
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
                  <Link
                    key={o.id}
                    className={`${
                      o.datos.productoSeleccionado.every(
                        (producto) =>
                          parseInt(producto.cantidad) ===
                          parseInt(producto.cantidadFaltante)
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    } py-2 px-4 rounded-xl text-white text-xs cursor-pointer flex items-center gap-1`}
                  >
                    {o.datos.productoSeleccionado.every(
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
                <article>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 underline">
                      Numero
                    </span>
                    <span className="text-normal text-sm text-slate-700">
                      {o.id}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 underline">
                      Proveedor
                    </span>
                    <span className="text-normal text-sm text-slate-700">
                      {o.proveedor}
                    </span>
                  </p>

                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 underline">
                      Numero Remito/Factura
                    </span>
                    <span className="text-normal text-sm text-slate-700">
                      N° {o.numero_factura}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 underline">
                      Fecha factura/remito
                    </span>
                    <span className="text-normal text-sm text-slate-700">
                      {new Date(o.fecha_factura).toLocaleDateString("es-ES")}
                    </span>
                  </p>
                  <p className="uppercase flex gap-1">
                    <span className="font-semibold text-sm text-slate-700 underline">
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
                  <p className="text-slate-500 uppercase font-semibold text-sm underline">
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
        )}
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
    </section>
  );
};
