import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirCompras } from "../pdf/ImprimirCompras";

export const ModalProveedores = ({ compras, total, fechaFin, fechaInicio }) => {
  return (
    <dialog id="my_modal_proveedores" className="modal">
      <div className="modal-box max-w-6xl scrollbar-hidden">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Compras por proveedor</h3>
        <p className="py-2">Observa el total de compras por proveedor.</p>

        <PDFViewer
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <ImprimirCompras
            compras={compras}
            total={total}
            fechaFin={fechaFin}
            fechaInicio={fechaInicio}
          />
        </PDFViewer>
      </div>
    </dialog>
  );
};
