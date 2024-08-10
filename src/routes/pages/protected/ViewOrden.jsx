import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprirmirComprobanteCompra } from "../../../components/pdf/ImprirmirComprobanteCompra";
import client from "../../../api/axios";
import { FaArrowLeft } from "react-icons/fa";
import { ButtonLink } from "../../../components/ui/ButtonLink";

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

  return (
    <section className="min-h-screen max-h-full h-full  w-full max-w-full">
      <ButtonLink link={"/ordenes"} />
      <div className="bg-gray-100 py-14 px-10">
        <p className="font-bold text-xl">
          Orden de compra obtenida n° {params.id}, proveedor{" "}
          <span className="capitalize text-primary">{orden.proveedor}</span>.
        </p>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-5 max-md:my-5">
        <div className="dropdown dropdown-bottom dropdown-hover">
          <button className="font-bold text-sm bg-primary py-2 px-4 text-white rounded">
            Ver estadistica de la compra
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-0.5 bg-gray-800 w-[500px] rounded-md max-md:w-80"
          >
            <div className="py-5 px-5 grid grid-cols-2 gap-2 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-2 bg-white py-3 px-3 rounded-md">
                <p className="font-medium text-sm">
                  Total de la orden + el iva.
                </p>
                <p className="font-bold text-lg">
                  {Number(orden.precio_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="py-5 px-5 bg-gray-800 rounded-md text-white mx-4 max-md:w-auto max-md:overflow-x-auto max-md:mx-5 scrollbar-hidden">
        <div>
          <h5 className="font-semibold">Datos de la orden de compra.</h5>
        </div>
        <div className="mt-2 flex gap-5 max-md:flex-col max-md:gap-2s">
          <p className="text-gray-200  text-sm border-r pr-3 border-primary max-md:border-none">
            <span className="font-bold">Numero de la compra: </span>
            {orden.id}
          </p>
          <p className="text-gray-200  text-sm border-r pr-3 border-primary max-md:border-none">
            <span className="font-bold">Proveedor: </span>
            {orden.proveedor}
          </p>

          <p className="text-gray-200  text-sm border-r pr-3 border-primary max-md:border-none">
            <span className="font-bold">Localidad: </span>
            {orden.localidad}
          </p>

          <p className="text-gray-200  text-sm border-r pr-3 border-primary max-md:border-none">
            <span className="font-bold">Provincia: </span>
            {orden.provincia}
          </p>

          <p className="text-gray-200  text-sm border-r pr-3 border-primary max-md:border-none">
            <span className="font-bold">Numero Fact/Remito: </span>
            N° {orden.numero_factura}
          </p>
          <p className="text-gray-200  text-sm pr-3">
            <span className="font-bold">Fecha de la factura: </span>
            {new Date(orden?.fecha_factura).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>

      <div className="mx-5 mt-5 max-md:mx-0">
        <div>
          <h5 className="bg-white py-5 px-5 font-bold max-md:py-2">
            Productos de la compra.
          </h5>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 max-md:grid-cols-1 max-md:mx-5">
          {orden?.datos?.productoSeleccionado?.map((producto) => (
            <div
              className="border py-5 px-5 rounded-md border-gray-300 capitalize"
              key={producto.id}
            >
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Detalle: </span>
                {producto.detalle}
              </p>
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Categoria: </span>
                {producto.categoria}
              </p>
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Precio unitario: </span>
                {Number(producto.precio_und).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className=" text-sm font-bold text-primary">
                <span className="font-bold">Cantidad: </span>
                {producto.cantidad}
              </p>
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Total sin iva: </span>
                {Number(producto.totalFinal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Iva seleccionado: </span>
                {(producto.iva === 1.105 && "IVA DEL 10.05") ||
                  (producto.iva === 1.21 && "IVA DEL 21.00") ||
                  (producto.iva === 0 && "NO TIENE IVA")}
              </p>
              <p className="text-slate-700  text-sm">
                <span className="font-bold">Total con iva: </span>
                <span className="font-bold text-blue-600">
                  {" "}
                  {Number(producto.totalFinalIva).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </p>
              <div className="mt-2 flex gap-2 items-center justify-end">
                <button
                  type="button"
                  className="bg-green-100 text-green-700 text-sm py-2 px-4 rounded-md flex items-center gap-1 font-semibold"
                >
                  {Number(producto.totalFinalIva / 10000).toFixed(2)}%
                </button>
                <button
                  type="button"
                  className="bg-primary text-sm py-2 px-4 rounded-md text-white flex items-center gap-1 font-semibold"
                >
                  {Number(producto.totalFinalIva).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm mt-9 mx-5 flex max-md:pb-4">
        <PDFDownloadLink
          download={false}
          target="_blank"
          document={<ImprirmirComprobanteCompra datos={orden} />}
          className="bg-primary text-white py-1.5 text-sm px-5 rounded-md font-semibold flex gap-2 items-center max-md:rounded-xl"
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
    </section>
  );
};
