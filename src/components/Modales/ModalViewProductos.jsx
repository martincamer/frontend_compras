import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirProductos } from "../pdf/ImprimirProductos";
export const ModalViewProductos = ({ fecha, fechaFin, productos }) => {
  return (
    <dialog id="my_modal_view_productos" className="modal">
      <div className="modal-box max-w-6xl h-full scrollbar-hidden">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Descarga o imprime la lista de productos comparativa.
        </h3>
        <PDFViewer
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <ImprimirProductos
            productos={productos}
            fechaInicio={fecha}
            fechaFin={fechaFin}
          />
        </PDFViewer>
      </div>
    </dialog>
  );
};
