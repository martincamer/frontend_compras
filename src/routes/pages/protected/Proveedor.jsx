import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import client from "../../../api/axios";
import { ModalComprobante } from "../../../components/Modales/ModalComprobante";

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
              {Number(comprobantes?.length / 10 || 0).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total pagos cargados
            </strong>

            <p>
              <span className="text-xl font-medium text-red-600 max-md:text-base">
                {Number(comprobantes?.length || 0)}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                total final{" "}
                <span className="font-bold text-slate-700">
                  {Number(comprobantes?.length || 0)}
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
              {Number(datos?.total / 100000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total deuda
            </strong>

            <p>
              <span className="text-xl font-medium text-red-600 max-md:text-base">
                {" "}
                {Number(datos?.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                total final deuda{" "}
                <span className="font-bold text-slate-700">
                  {Number(datos?.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </span>
            </p>
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
        <button className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs flex gap-2 items-center">
          Ver resumenes de los comprobantes
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
        </button>
      </div>

      <div className="mx-8 mt-6">
        <p className="underline text-indigo-500 uppercase font-semibold">
          Tabla de comprobantes cargados del mes
        </p>
      </div>

      <div className="overflow-x-auto mt-6 mx-8 rounded-xl border-slate-300 border-[1px]">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              {/* <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Numero °
              </th> */}
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Total del comprobante
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-semibold">
                Total del comprobante final
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
            {currentProducts.map((p) => (
              <tr key={p.id}>
                {/* <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                  {p.id}
                </td> */}
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
                    className="bg-green-500/20 text-green-600 py-2 px-3 rounded-xl text-sm"
                  >
                    DESCARGAR COMPROBANTE
                  </Link>
                  {/* <span className="bg-red-500/10 text-red-800 py-2 px-3 rounded-xl text-sm">
                    ELIMINAR
                  </span> */}
                </td>
                <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-sm">
                  {p.created_at.split("T")[0]}
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
    </section>
  );
};
