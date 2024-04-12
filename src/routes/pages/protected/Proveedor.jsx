import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { ModalComprobante } from "../../../components/Modales/ModalComprobante";
import { ModalObtenerCompra } from "../../../components/Modales/ModalObtenerCompra";
import client from "../../../api/axios";

export const Proveedor = () => {
  const [datos, setDatos] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);

  const [isOpenComprobante, setOpenComprobante] = useState(false);

  const openComprobante = () => {
    setOpenComprobante(true);
  };

  const closeComprobante = () => {
    setOpenComprobante(false);
  };

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

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/proveedor/${params.id}`);

      setDatos(res.data);
    }

    loadData();
  }, [params.id]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(
        `/comprobantes${params.id ? `?params=${params.id}` : ""}`
      );

      setComprobantes(res.data);
    }

    loadData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Ordenar los comprobantes por fecha de creación de manera descendente
  const sortedComprobantes = comprobantes?.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  // Obtener los productos actuales para la página actual
  const currentProducts = sortedComprobantes?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalEnComprobantes = comprobantes.reduce((acc, comprobante) => {
    return acc + parseFloat(comprobante.total);
  }, 0);

  const [isComprobante, setIsComprobante] = useState(false);
  const [obtenerId, setObtenerId] = useState("");

  const openComprobanteModal = () => {
    setIsComprobante(true);
  };

  const closeComprobanteModal = () => {
    setIsComprobante(false);
  };

  const handleID = (id) => setObtenerId(id);

  // Agrega los estados para las fechas inicial y final
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // Función para filtrar productos por rango de fechas
  const filtrarPorFecha = (producto) => {
    if (!fechaInicial || !fechaFinal) {
      return true; // Si alguna de las fechas no está establecida, no se aplica el filtro
    }

    const fechaProducto = new Date(producto.created_at).getTime();
    const fechaInicialTimestamp = new Date(fechaInicial).getTime();
    const fechaFinalTimestamp = new Date(fechaFinal).getTime();

    return (
      fechaProducto >= fechaInicialTimestamp &&
      fechaProducto <= fechaFinalTimestamp
    );
  };

  // Filtrar productos por fecha
  const productosFiltrados = currentProducts.filter(filtrarPorFecha);

  const resetFechas = () => {
    setFechaFinal("");
    setFechaInicial("");
  };

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />

      <div className="mx-6 mt-5">
        <p className="uppercase text-lg">
          <span className="font-bold text-slate-800">Proveedor:</span>{" "}
          <span className="text-slate-500 underline">{datos?.proveedor}</span>
        </p>
      </div>
      <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
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
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {Number(comprobantes.length)}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total comprobantes cargados
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
              {Number(comprobantes.length / 1).toFixed(2)} %{" "}
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
                {Number(datos.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total deuda proveedor
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
              {Number(datos.total / 100000).toFixed(2)} %
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
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {Number(totalEnComprobantes).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en comprobantes a favor
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600">
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
              {Number(totalEnComprobantes / 100000).toFixed(2)} %
            </span>
          </div>
        </article>
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openComprobante()}
          className="bg-green-100 py-2 px-4 rounded-xl text-sm text-green-700 uppercase max-md:text-xs flex gap-2 items-center hover:bg-green-500 hover:text-white transition-all ease-linear"
        >
          Cargar nuevo comprobante de pago
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
              d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
            />
          </svg>
        </button>
      </div>

      <div className="mx-8 mt-6">
        <p className="underline text-indigo-500 uppercase font-semibold">
          Tabla de comprobantes cargados del mes
        </p>
      </div>

      <div className="flex gap-4 mb-1 mt-6 mx-9 items-center">
        <input
          type="date"
          value={fechaInicial}
          onChange={(e) => setFechaInicial(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl text-sm uppercase"
        />

        <span className="uppercase font-bold text-sm text-slate-700">
          desde
        </span>
        <input
          type="date"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl text-sm uppercase"
        />

        <div>
          <button
            className="uppercase text-sm bg-red-100 text-red-800 py-2 px-4 rounded-xl"
            type="button"
            onClick={() => resetFechas()}
          >
            Volver al mes normal/resetear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6 mx-8 rounded-xl border-slate-300 border-[1px]">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Numero °
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Total del comprobante
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Total del comprobante final
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Ver Comprobante
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Acciones
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Fecha de creación
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm">
                  {p.id}
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm">
                  {Number(p.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-green-800 uppercase text-sm font-bold">
                  {" "}
                  <span className="bg-green-100 py-3 px-5 rounded-xl">
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm cursor-pointer space-x-2">
                  <Link
                    // to={`/proveedores/${p.id}`}
                    onClick={() => {
                      handleID(p.id), openComprobanteModal();
                    }}
                    className="bg-indigo-500/20 text-indigo-600 py-2 px-3 rounded-xl text-sm hover:bg-indigo-500 hover:text-white transition-all ease-linear"
                  >
                    VER COMPROBANTE
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm cursor-pointer space-x-2">
                  <Link
                    target="_blank"
                    to={`/pdf-comprobante/${p.id}`}
                    className="bg-green-500/20 text-green-600 py-2 px-3 rounded-xl text-sm"
                  >
                    DESCARGAR COMPROBANTE
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                  {p?.created_at?.split("T")[0]} / <strong>HORA:</strong>{" "}
                  {p?.created_at?.split("T")[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {comprobantes.length > productsPerPage && (
          <nav className="pagination">
            <ul className="pagination-list flex gap-2">
              {Array.from({
                length: Math.ceil(comprobantes.length / productsPerPage),
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
      <ModalComprobante
        isOpen={isOpenComprobante}
        closeModal={closeComprobante}
        OBTENERID={params.id}
        datos={datos}
      />
      <ModalObtenerCompra
        isOpen={isComprobante}
        closeModal={closeComprobanteModal}
        obtenerId={obtenerId}
      />
    </section>
  );
};
