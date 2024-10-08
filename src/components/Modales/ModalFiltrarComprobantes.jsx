import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";
import { ImprimirComprantePdf } from "../pdf/ImprimirComprantePdf";
import client from "../../../src/api/axios";
import { ImprimirTodosLosComprobantes } from "../pdf/ImprimirTodosLosComprobantes";

export const ModalFiltrarComprobantes = ({}) => {
  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const [ordenesBuscadas, setOrdenesBuscadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerOrdenesRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/comprobantes-rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setOrdenesBuscadas(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener salidas:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const buscarIngresosPorFecha = () => {
    obtenerOrdenesRangoFechas(fechaInicio, fechaFin);
  };

  const agrupadosPorProveedor = ordenesBuscadas.reduce((acc, comprobante) => {
    const { proveedor, total } = comprobante;
    const proveedorExistente = acc.find((item) => item.proveedor === proveedor);

    if (proveedorExistente) {
      proveedorExistente.total += Number(total);
    } else {
      acc.push({
        proveedor: proveedor,
        total: Number(total),
      });
    }

    return acc;
  }, []);

  return (
    <dialog id="my_modal_proveedores" className="modal">
      <div className="modal-box max-w-6xl h-full rounded-md scrollbar-hidden">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div>
          <p className="font-bold text-gray-900 text-lg">
            Filtrar comprobantes por fecha.
          </p>
        </div>
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start mt-5">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-semibold capitalize text-slate-700">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 font-bold border-gray-300 rounded-md border cursor-pointer outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-semibold capitalize text-slate-700">
              Fecha fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 font-bold border-gray-300 rounded-md border cursor-pointer outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <button
              onClick={buscarIngresosPorFecha}
              className="bg-white border-gray-300 rounded-full border-[1px] px-2 py-2 flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full h-full mt-10 max-md:hidden">
          <PDFViewer className="w-full h-full">
            <ImprimirComprantePdf
              datos={agrupadosPorProveedor}
              fechaFin={fechaFin}
              fechaInicio={fechaInicio}
            />
          </PDFViewer>
        </div>{" "}
        <div className="w-full h-full mt-10 max-md:hidden">
          <PDFViewer className="w-full h-full">
            <ImprimirTodosLosComprobantes
              datos={ordenesBuscadas}
              datosAgrupados={agrupadosPorProveedor}
              fechaFin={fechaFin}
              fechaInicio={fechaInicio}
            />
          </PDFViewer>
        </div>
        <div className="flex flex-col mt-5 gap-2">
          <PDFDownloadLink
            className="bg-gradient-to-r from-primary to-blue-500 text-white px-2 py-1 rounded-md md:hidden font-semibold text-center"
            document={
              <ImprimirComprantePdf
                datos={agrupadosPorProveedor}
                fechaFin={fechaFin}
                fechaInicio={fechaInicio}
              />
            }
          >
            Descargar proveedor pagos
          </PDFDownloadLink>
          <PDFDownloadLink
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 py-1 rounded-md md:hidden font-semibold text-center"
            document={
              <ImprimirComprantePdf
                datos={agrupadosPorProveedor}
                fechaFin={fechaFin}
                fechaInicio={fechaInicio}
              />
            }
          >
            {" "}
            Descargar comprobantes pagados{" "}
          </PDFDownloadLink>
        </div>
      </div>
    </dialog>
  );
};
