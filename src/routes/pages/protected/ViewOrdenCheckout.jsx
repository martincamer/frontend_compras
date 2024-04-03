import { useEffect, useState } from "react";
import client from "../../../api/axios";
import { useParams } from "react-router-dom";
import { ModalEditarEntrega } from "../../../components/Modales/ModalEditarEntrega";
import { ToastContainer } from "react-toastify";

export const ViewOrdenCheckout = () => {
  const [orden, setOrden] = useState([]);
  const [isEntrega, setIsEntega] = useState(false);
  const [OBTENERID, setObtenerId] = useState(null);

  const openEntrega = () => setIsEntega(true);
  const closeEntrega = () => setIsEntega(false);

  const handleID = (id) => setObtenerId(id);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/orden/${params.id}`);

      setOrden(res.data);
    }
    loadData();
  }, [params.id]);

  console.log(orden);

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

  return (
    <section className="w-full h-full px-5 max-md:px-4 flex flex-col gap-2 py-16 max-md:gap-5">
      <ToastContainer />
      <div className="py-5 px-5 rounded-xl grid grid-cols-2 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
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
              {Number(orden.precio_final / 100000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total de la compra
            </strong>

            <p>
              <span className="text-xl font-medium text-red-600 max-md:text-base">
                -{" "}
                {Number(orden.precio_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                final gastado{" "}
                <span className="font-bold text-slate-700">
                  {Number(orden.precio_final).toLocaleString("es-AR", {
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
      </div>

      <div className="mt-4 border-slate-200 shadow border-[1px] py-5 px-5 rounded-xl mx-4">
        <div>
          <h5 className="underline text-orange-500 text-lg">
            DATOS DE LA COMPRA
          </h5>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Numero de la compra: </span>
            {orden.id}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Proveedor: </span>
            {orden.proveedor}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Localidad: </span>
            {orden.localidad}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Provincia: </span>
            {orden.provincia}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Numero Fact/Remito: </span>
            N° {orden.numero_factura}
          </p>
          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Fecha de la factura: </span>
            {new Date(orden?.fecha_factura).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>

      <div className="mt-4 border-slate-200 shadow border-[1px] py-5 px-5 rounded-xl mx-4">
        <div>
          <h5 className="underline text-orange-500 text-lg">PRODUCTOS</h5>

          {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}

          <div className="overflow-x-auto rounded-xl border border-slate-300 shadow mt-5">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CODIGO
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CATEGORIA
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    DETALLE
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CANTIDAD
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CANTIDAD ENTREGADA
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    OPCIONES
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    ESTADO
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orden?.datos?.productoSeleccionado?.map((p, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 text-sm">
                      {p.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.categoria}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.detalle}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.cantidad}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.cantidadFaltante}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm flex gap-2">
                      <button
                        onClick={() => {
                          handleID(p.id), openEntrega();
                        }}
                        className="text-xs font-bold py-2 px-4 rounded-xl bg-green-500 text-white"
                        type="button"
                      >
                        EDITAR/ENTREGADA
                      </button>
                      {/* <button
                        className="text-xs font-bold py-2 px-4 rounded-xl bg-orange-500 text-white"
                        type="button"
                      >
                        EDITAR/PRODUCTO
                      </button> */}
                      <button
                        className="text-xs font-bold py-2 px-4 rounded-xl bg-red-500 text-white"
                        type="button"
                      >
                        ELIMINAR
                      </button>
                    </td>
                    <td
                      className={` whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm`}
                    >
                      <span
                        className={`${
                          p.cantidad === p.cantidadFaltante
                            ? " bg-green-500 py-2 font-semibold px-4 rounded-xl shadow text-white text-sm"
                            : "bg-red-500 py-2 font-semibold px-4 rounded-xl shadow text-white text-sm"
                        }`}
                      >
                        {p.cantidad === p.cantidadFaltante
                          ? "FINALIZADO"
                          : "PENDIENTE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalEditarEntrega
        setOrden={setOrden}
        orden={orden}
        closeModal={closeEntrega}
        isOpen={isEntrega}
        OBTENERID={OBTENERID}
      />
    </section>
  );
};
