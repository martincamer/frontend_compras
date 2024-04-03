import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { PDFDownloadLink } from "@react-pdf/renderer";
import client from "../../../api/axios";
import { ImprirmirProductosPDF } from "../../../components/pdf/ImprirmirProductosPDF";

export const ProductosOrdenesFiltrador = () => {
  const [ordenesBuscadas, setOrdenesBuscadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const handleChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = ordenesBuscadas.flatMap((orden) =>
    orden.datos.productoSeleccionado
      .map((producto) => ({
        ...producto,
        proveedor: orden.proveedor, // Agregar la información del proveedor al producto
      }))
      .filter(
        (producto) =>
          producto.detalle.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategory === "all" ||
            producto.categoria === selectedCategory)
      )
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const totalFinal = currentProducts.reduce(
    (total, producto) => total + producto.totalFinal,
    0
  );

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
              to={"/ordenes"}
              href="#"
              className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
            >
              ORDENES
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-5 mx-6 mb-2">
        <h4 className="underline text-orange-500 font-semibold text-lg">
          BUSCAR POR LOS PRODUCTOS/COMPARAR PRECIOS/ETC
        </h4>
      </div>

      <div className="mx-6 flex gap-4 items-center">
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

        <div>
          <PDFDownloadLink
            className="bg-green-500 text-white py-2 px-5 shadow rounded-xl uppercase"
            fileName="productos_filtrados"
            target="_blank"
            download={false}
            document={<ImprirmirProductosPDF datos={currentProducts} />}
          >
            Descargar productos filtrados
          </PDFDownloadLink>
        </div>
      </div>

      <div className="mx-6 mt-4 flex gap-2 max-md:flex-col max-md:items-start items-center">
        <input
          type="text"
          placeholder="Buscar por detalle..."
          className="w-1/4 rounded-xl py-2 px-5 border-slate-300 shadow bg-white text-slate-700 border-[1px] uppercase"
          value={searchTerm}
          onChange={handleChangeSearchTerm}
        />

        <select
          className="py-3 px-4 text-slate-700 rounded-xl shadow bg-white border-slate-300 border-[1px] uppercase"
          value={selectedCategory}
          onChange={handleChangeCategory}
        >
          <option value="all">Todas las categorías</option>
          {/* Aquí puedes insertar opciones de categorías si las tienes */}
        </select>

        <div className="border-slate-300 border-[1px] text-red-600 font-semibold py-3 px-5 rounded-xl shadow">
          {Number(totalFinal).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mx-6">
        {loading ? ( // Verifica si está cargando
          <div className="flex justify-center items-center col-span-3 border-slate-300 py-12 px-6 rounded-xl border-[1px] shadow">
            <SyncLoader color={"#4a90e2"} loading={loading} size={5} />
            <p className="text-gray-700 ml-2 uppercase">
              Cargando productos...
            </p>
          </div>
        ) : (
          // Si no está cargando, mostrar los productos
          currentProducts.map((producto, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border-slate-200 border-[1px] p-4 flex flex-col gap-1"
            >
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">PROVEEDOR:</span>{" "}
                {producto.proveedor}
              </p>
              <p className="text-sm uppercase text-slate-700">
                <span className="font-bold">DETALLE:</span> {producto.detalle}
              </p>
              <p className="text-sm uppercase text-slate-700">
                <span className="font-bold">CATEGORIA:</span>{" "}
                {producto.categoria}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Precio Unitario: </span>
                {Number(producto.precio_und).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Cantidad: </span>{" "}
                {producto.cantidad}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Total: </span>
                {Number(producto.totalFinal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
            </div>
          ))
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
