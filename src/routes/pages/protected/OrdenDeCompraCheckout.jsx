import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import { Link } from "react-router-dom";

export const OrdenDeCompraCheckout = () => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

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

  console.log("Cantidad total:", cantidadTotal);
  console.log("Cantidad faltante total:", cantidadFaltanteTotal);

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />

      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 shadow">
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

        <article className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-8 shadow">
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

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
      <div className="py-3 px-4 rounded-xl mx-8 mt-2">
        <div className="grid grid-cols-3 h-full w-full gap-4">
          {currentProducts
            .filter((order) => {
              // Verifica si la orden está pendiente
              return order.datos.productoSeleccionado.some(
                (producto) =>
                  parseInt(producto.cantidad) !==
                  parseInt(producto.cantidadFaltante)
              );
            })
            .map((o, index) => (
              <div
                className="shadow border-slate-200 border-[1px] rounded-xl pt-14 pb-6 px-5 flex justify-between items-center relative"
                key={o.id}
              >
                <div className="absolute top-2 right-5 flex items-center gap-2">
                  <Link
                    to={`/orden-checkout/${o.id}`}
                    className="py-2 px-4 rounded-xl text-indigo-500 text-xs bg-indigo-100 cursor-pointer flex items-center gap-1"
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
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100  text-red-700"
                    } py-2 px-4 rounded-xl text-xs cursor-pointer flex items-center gap-1`}
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

      {/* <ModalCrearOrden isOpen={isOpen} closeModal={closeModal} /> */}
      {/* <ModalEliminar
        eliminarModal={isOpenEliminar}
        closeEliminar={closeEliminar}
        obtenerId={obtenerId}
      /> */}
    </section>
  );
};
