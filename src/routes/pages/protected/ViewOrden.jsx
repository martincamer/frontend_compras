import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ModalEditarProductoOrden } from "../../../components/Modales/ModalEditarProductoOrden";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import client from "../../../api/axios";
import { ImprirmirComprobanteCompra } from "../../../components/pdf/ImprirmirComprobanteCompra";

export const ViewOrden = () => {
  const [orden, setOrden] = useState([]);

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

  const [isOpen, setIsOpen] = useState(false);
  const [idOrden, setIdOrden] = useState(null);
  const [idProducto, setIdProducto] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleIdProducto = (id) => setIdProducto(id);
  const handleIdOrden = (id) => setIdOrden(id);

  const handleEliminarProducto = async (idProducto) => {
    try {
      await client.delete(`/orden/${params.id}/producto/${idProducto}`);
      // Actualizar la orden después de eliminar el producto

      setTimeout(() => {
        location.reload();
      }, 500);
      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

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
      <div className="py-5 px-5 rounded-xl grid grid-cols-4 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-300 hover:shadow-md transition-all ease-linear cursor-pointer bg-white p-6 max-md:p-3">
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-300 hover:shadow-md transition-all ease-linear cursor-pointer bg-white p-6 max-md:p-3">
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

      <div className="mt-4 border-slate-300 transition-all ease-linear cursor-pointer hover:shadow-md border-[1px] py-5 px-5 rounded-2xl mx-4">
        <div>
          <h5 className="underline text-indigo-500 text-lg">
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

      <div className="mx-5 mt-5">
        <div>
          <h5 className="underline text-indigo-500 text-lg">PRODUCTOS</h5>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {orden?.datos?.productoSeleccionado?.map((producto) => (
            <div
              className="bg-slate-100/10 hover:shadow-md transition-all ease-linear cursor-pointer rounded-xl py-4 px-4 border-slate-300 border-[1px]"
              key={producto.id}
            >
              <p className="text-slate-700 text-base uppercase">
                <span className="font-bold">Detalle: </span>
                {producto.detalle}
              </p>
              <p className="text-slate-700 text-base uppercase">
                <span className="font-bold">Categoria: </span>
                {producto.categoria}
              </p>
              <p className="text-slate-700 text-base uppercase">
                <span className="font-bold">Precio unitario: </span>
                {Number(producto.precio_und).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className="text-slate-700 text-base uppercase">
                <span className="font-bold">Cantidad: </span>
                {producto.cantidad}
              </p>
              <p className="text-slate-700 text-base uppercase">
                <span className="font-bold">Total: </span>
                {Number(producto.totalFinal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <div className="mt-2 flex gap-2 items-center justify-end">
                <button
                  onClick={() => {
                    handleIdOrden(params.id),
                      handleIdProducto(producto.id),
                      openModal();
                  }}
                  type="button"
                  className="bg-green-100 text-green-700 text-sm py-2 px-4 rounded-xl flex items-center gap-1"
                >
                  EDITAR
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                {/* <button
                  onClick={() => handleEliminarProducto(producto.id)}
                  type="button"
                  className="bg-red-100 text-red-800 text-sm py-2 px-4 rounded-xl flex items-center gap-1"
                >
                  ELIMINAR
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm mt-9 mx-5 flex">
        <PDFDownloadLink
          download={false}
          target="_blank"
          document={<ImprirmirComprobanteCompra datos={orden} />}
          className="bg-green-100 text-green-700 py-4 hover:shadow-md transition-all ease-linear px-5 rounded-xl uppercase flex gap-2 items-center"
        >
          Descargar comprobante orden de compra en pdf{" "}
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </PDFDownloadLink>
      </div>

      <ModalEditarProductoOrden
        idOrden={idOrden}
        idProducto={idProducto}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </section>
  );
};
