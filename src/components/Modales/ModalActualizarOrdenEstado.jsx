import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import client from "../../api/axios";
import { showSuccessToast } from "../../helpers/toast";

export const ModalActualizarOrdenEstado = ({ idObtenida }) => {
  const [estado, setEstado] = useState("");
  const { setOrdenes } = useOrdenesContext();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/orden/${idObtenida}`);

      setEstado(respuesta.data.estado);
    }

    loadData();
  }, [idObtenida]);

  console.log(idObtenida);

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosOrden = {
      estado,
    };

    const res = await client.put(`/orden/estado/${idObtenida}`, datosOrden);

    document.getElementById("my_modal_actualizar_estado").close();

    setOrdenes(res.data);
    showSuccessToast("Estado actualizado");
  };

  return (
    <dialog id="my_modal_actualizar_estado" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">
              Selecciona el estado de la orden
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
            >
              <option className="capitalize font-bold text-primary">
                Seleccionar el estado
              </option>
              <option value={"pendiente"} className="capitalize font-semibold">
                Pendiente
              </option>
              <option value={"rechazada"} className="capitalize font-semibold">
                Rechazada
              </option>
              <option value={"aceptada"} className="capitalize font-semibold">
                Aceptada
              </option>
            </select>
          </div>

          <div className="mt-2">
            <button className="py-1.5 px-6 bg-gradient-to-r from-primary to-pink-500 hover:shadow-md text-white transition-all rounded-md font-semibold text-sm">
              Actualizar el estado
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
