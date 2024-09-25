import { PDFViewer } from "@react-pdf/renderer";
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

  return (
    <dialog id="my_modal_orden_compra_view" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-none scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-blue-500">
          Observa la orden de compra
        </h3>
        <p className="py-1 text-sm">
          En esta sección podras descargar o imprimir la orden de compra directo
          desde aca.
        </p>
        <PDFViewer className="w-full h-full mt-5">
          <ImprirmirComprobanteCompra datos={orden} />
        </PDFViewer>
      </div>
    </dialog>
  );
};
