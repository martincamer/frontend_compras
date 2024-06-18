import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ImprirmirComprobanteCompra } from "../../../components/pdf/ImprirmirComprobanteCompra";
import client from "../../../api/axios";

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
    <section className="min-h-screen max-h-full h-full">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/ordenes"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-sky-600"
        >
          Compras
        </Link>{" "}
        <Link className="bg-sky-500 flex h-full px-4 justify-center items-center font-bold text-white">
          Compra obtenida N° {params.id}
        </Link>
      </div>
      <div className="bg-white py-5 px-5 mx-5 mt-10">
        <h3 className="text-xl font-bold text-sky-500">
          Observa tu orden de compra facturada del proveedor{" "}
          <span className="capitalize text-black">{orden.proveedor}</span>
        </h3>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadistica de la compra
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
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

      <div className="bg-white mt-4 border-sky-300 transition-all ease-linear cursor-pointer hover:shadow-md border-[1px] py-5 px-5 shadow-lg mx-4 max-md:mx-0 max-md:w-auto">
        <div>
          <h5 className="underline text-sky-400 font-semibold">
            DATOS DE LA COMPRA
          </h5>
        </div>
        <div className="mt-2 flex gap-5">
          <p className="text-slate-700 uppercase text-sm border-r pr-3 border-sky-300">
            <span className="font-bold">Numero de la compra: </span>
            {orden.id}
          </p>

          <p className="text-slate-700 uppercase text-sm border-r pr-3 border-sky-300">
            <span className="font-bold">Proveedor: </span>
            {orden.proveedor}
          </p>

          <p className="text-slate-700 uppercase text-sm border-r pr-3 border-sky-300">
            <span className="font-bold">Localidad: </span>
            {orden.localidad}
          </p>

          <p className="text-slate-700 uppercase text-sm border-r pr-3 border-sky-300">
            <span className="font-bold">Provincia: </span>
            {orden.provincia}
          </p>

          <p className="text-slate-700 uppercase text-sm border-r pr-3 border-sky-300">
            <span className="font-bold">Numero Fact/Remito: </span>
            N° {orden.numero_factura}
          </p>
          <p className="text-slate-700 uppercase text-sm">
            <span className="font-bold">Fecha de la factura: </span>
            {new Date(orden?.fecha_factura).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>

      <div className="mx-5 mt-5 max-md:mx-0">
        <div>
          <h5 className="bg-white py-5 px-5 text-sky-500 font-bold text-base border-sky-300 border max-md:mx-5">
            PRODUCTOS
          </h5>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 max-md:grid-cols-1">
          {orden?.datos?.productoSeleccionado?.map((producto) => (
            <div
              className="bg-white hover:shadow-md transition-all ease-linear cursor-pointer py-4 px-4 border-sky-300 border-[1px] max-md:rounded-none"
              key={producto.id}
            >
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Detalle: </span>
                {producto.detalle}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Categoria: </span>
                {producto.categoria}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Precio unitario: </span>
                {Number(producto.precio_und).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className="uppercase text-sm font-semibold text-sky-500">
                <span className="font-bold">Cantidad: </span>
                {producto.cantidad}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Total sin iva: </span>
                {Number(producto.totalFinal).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Iva seleccionado: </span>
                {(producto.iva === 1.105 && "IVA DEL 10.05") ||
                  (producto.iva === 1.21 && "IVA DEL 21.00") ||
                  (producto.iva === 0 && "NO TIENE IVA")}
              </p>
              <p className="text-slate-700 uppercase text-sm">
                <span className="font-bold">Total con iva: </span>
                <span className="font-bold text-orange-500">
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
                  className="bg-green-100 text-green-700 text-sm py-2 px-4 rounded-xl flex items-center gap-1 font-semibold"
                >
                  {Number(producto.totalFinalIva / 10000).toFixed(2)}%
                </button>
                <button
                  type="button"
                  className="bg-sky-100 text-sky-700 text-sm py-2 px-4 rounded-xl flex items-center gap-1 font-semibold"
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

      <div className="text-sm mt-9 mx-5 flex">
        <PDFDownloadLink
          download={false}
          target="_blank"
          document={<ImprirmirComprobanteCompra datos={orden} />}
          className="bg-green-500/90 text-white py-3 px-5 rounded-full font-semibold uppercase flex gap-2 items-center text-xs max-md:rounded-xl"
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
