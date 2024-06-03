import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirGastosMateriales } from "../pdf/ImprimirGastosMateriales";
import React from "react";

export const ModalImprimir = ({ datos, fechaInicio, fechaFin }) => {
  return (
    <dialog id="my_modal_gastos_materiales" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="w-full h-full">
          <PDFViewer className="w-full h-full">
            <ImprimirGastosMateriales
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              datos={datos}
            />
          </PDFViewer>
        </div>
      </div>
    </dialog>
  );
};
