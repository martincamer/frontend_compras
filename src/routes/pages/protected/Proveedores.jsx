import { useState } from "react";
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

  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [productsPerPage] = useState(9);

  // // Lógica de paginación
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  // // Cambiar de página
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const precioTotal = ordenesMensuales.reduce(
  //   (total, orden) => total + Number(orden.precio_final),
  //   0
  // );

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
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
              {/* {Number(precioTotal / 100000).toFixed(2)} % */}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total en proveedores
            </strong>

            <p>
              <span className="text-xl font-medium text-red-600 max-md:text-base">
                {/* -{" "}
                {Number(precioTotal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })} */}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                deuda final{" "}
                <span className="font-bold text-slate-700">
                  {/* {Number(precioTotal).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })} */}
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
      </div>

      <div className="mx-10 py-2 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2">
        <button
          onClick={() => openModal()}
          className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs"
        >
          Creear nuevo proveedor
        </button>
        <button className="bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl text-sm shadow text-slate-700 uppercase max-md:text-xs">
          Ver resumenes de los proveedores
        </button>
      </div>

      <div className="mx-6 mt-6">
        <p className="underline text-orange-500 uppercase font-semibold">
          Proveedores tabla de saldos
        </p>
      </div>

      <div className="overflow-x-auto mt-6 mx-8 rounded-xl border-slate-300 border-[1px] shadow">
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
            {proveedores.map((p) => (
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
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-sm cursor-pointer space-x-2">
                  <Link
                    to={`/proveedores/${p.id}`}
                    className="bg-green-500/20 text-green-600 py-2 px-3 rounded-xl text-sm"
                  >
                    CARGAR COMPROBANTES/DINERO
                  </Link>
                  <span className="bg-red-500/10 text-red-800 py-2 px-3 rounded-xl text-sm">
                    ELIMINAR
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCrearProveedor isOpen={isOpen} closeModal={closeModal} />
    </section>
  );
};
