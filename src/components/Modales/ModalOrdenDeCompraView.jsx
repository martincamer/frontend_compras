import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import client from "../../api/axios";
import { ImprirmirComprobanteCompra } from "../pdf/ImprirmirComprobanteCompra";

export const ModalOrdenDeCompraView = ({ idObtenida }) => {
  const [orden, setOrden] = useState([]);
  useEffect(() => {
    const obtenerOrdenCompra = async () => {
      const res = await client.get(`/orden/${idObtenida}`);
      setOrden(res.data);
    };

    obtenerOrdenCompra();
  }, [idObtenida]);

  const imagenes = orden.imagenes ? JSON.parse(orden.imagenes) : [];
  return (
    <dialog id="my_modal_orden_compra_view" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-md scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Observa la orden de compra y documentos añadidos.
        </h3>
        <p className="py-1 text-sm">
          En esta sección podras descargar o imprimir la orden de compra directo
          desde aca.
        </p>
        <PDFViewer className="w-full h-full mt-5 max-md:hidden">
          <ImprirmirComprobanteCompra datos={orden} />
        </PDFViewer>
        <div className="mt-4">
          <PDFDownloadLink
            className="bg-gradient-to-r from-primary to-blue-500 py-2 px-4 rounded-md text-white font-bold text-sm"
            document={<ImprirmirComprobanteCompra datos={orden} />}
          >
            Descargar orden de compra
          </PDFDownloadLink>
        </div>
        <div className="mt-5">
          <h4 className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Documentos asociados de la orden de compra.
          </h4>
          <div className="grid grid-cols-2 h-full w-full gap-4 mt-2 max-md:grid-cols-1">
            {imagenes.map((url, index) => {
              const isPDF = url.endsWith(".pdf");
              return (
                <div key={index} className="flex flex-col items-center">
                  {isPDF ? (
                    <div className="w-full h-full">
                      <iframe
                        className="w-full max-w-full h-screen"
                        src={url}
                        frameborder="0"
                      ></iframe>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Documento ${index + 1}`}
                      className="rounded shadow"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </dialog>
  );
};
