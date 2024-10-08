import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirProductos } from "../pdf/ImprimirProductos";
import { FaFilePdf } from "react-icons/fa";
export const ModalViewProductos = ({ fecha, fechaFin, productos }) => {
  return (
    <dialog id="my_modal_view_productos" className="modal">
      <div className="modal-box max-w-6xl  rounded-md h-full scrollbar-hidden">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-3">
          Descarga o imprime la lista de productos comparativa.
        </h3>
        <PDFViewer
          style={{
            width: "100%",
            height: "100vh",
          }}
          className="max-md:hidden"
        >
          <ImprimirProductos
            productos={productos}
            fechaInicio={fecha}
            fechaFin={fechaFin}
          />
        </PDFViewer>
        <PDFDownloadLink
          fileName={`Documento de materiales ${fecha} hasta ${fechaFin}`}
          className="text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-md font-semibold outline-none text-sm flex gap-2 items-center justify-between"
          document={
            <ImprimirProductos
              productos={productos}
              fechaInicio={fecha}
              fechaFin={fechaFin}
            />
          }
        >
          Descargar documento <FaFilePdf className="text-xl" />
        </PDFDownloadLink>
      </div>
    </dialog>
  );
};
