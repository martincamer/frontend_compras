import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import client from "../../api/axios";

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

    toast.success("¡Orden de compra creada correctamente!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        padding: "10px",
        background: "#b8ffb8",
        color: "#009900",
        borderRadius: "15px",
        boxShadow: "none",
      },
    });
  };

  return (
    <dialog id="my_modal_actualizar_estado" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Actualiza el estado de tu orden de compra.
        </h3>

        <form onSubmit={onSubmit} className="mt-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-700 uppercase">
              Selecciona el estado de la orden
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="py-2.5 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-sky-400 border rounded-none outline-none"
              placeholder="PROVEEDOR DE LA ORDEN"
            >
              <option className="capitalize font-bold text-sky-500">
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

          <div>
            <button className="bg-sky-500 text-white hover:bg-orange-500 transition-all font-semibold text-sm py-1.5 px-6 rounded-full mt-3">
              Actualizar el estado
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
