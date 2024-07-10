import { toast } from "react-toastify";
import client from "../../api/axios";
import { useProductosContext } from "../../context/ProductosProvider";
import { IoIosAlert } from "react-icons/io";

export const ModalEliminarProveedor = ({ idObtenida }) => {
  const { setProveedores } = useProductosContext();
  const handleEliminarOrden = async (id) => {
    try {
      const res = await client.delete(`/eliminar-proveedor/${id}`);

      setProveedores(res.data);

      toast.error("¡Proveedor eliminado correctamente!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffd1d1",
          color: "#de0202",
          borderRadius: "15px",
          boxShadow: "none",
        },
      });
      document.getElementById("my_modal_eliminar_proveedor").close();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };
  return (
    <dialog id="my_modal_eliminar_proveedor" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-center flex-col gap-2 items-center">
          <IoIosAlert className="text-yellow-400 text-9xl py-1" />

          <p className="text-3xl text-yellow-500">¡Espera! ✋</p>

          <p className="font-light text-sm mt-2">
            ¿Vas a eliminar el proveedor estás seguro?, no podras recuperar los
            datos.
          </p>

          <div className="mt-3 flex items-center justify-between gap-5">
            <button
              className="text-sm font-bold text-gray-400 hover:bg-gray-300 py-2 px-4 rounded-full hover:text-gray-600"
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar_proveedor").close()
              }
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                {
                  document
                    .getElementById("my_modal_eliminar_proveedor")
                    .close();
                  handleEliminarOrden(idObtenida);
                }
              }}
              className="text-base font-bold text-white bg-orange-500 hover:bg-orange-600 py-2 px-6 rounded-full hover:text-white"
              type="button"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
