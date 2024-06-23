import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import { IoIosAlert } from "react-icons/io";
import { useProductosContext } from "../../context/ProductosProvider";
import client from "../../api/axios";

export const ModalEliminarComprobante = ({
  eliminarModal,
  closeEliminar,
  obtenerId,
  setDatos,
  setComprobantes,
}) => {
  const { setProveedores } = useProductosContext();

  const handleEliminarOrden = async (id) => {
    try {
      const res = await client.delete(`/comprobante/${id}`);

      console.log(res.data);

      toast.error("¡Comprobante eliminado correctamente!", {
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

      closeEliminar();

      setDatos(res.data.updatedProveedor);
      setComprobantes(res.data.comprobantes);
      setProveedores(res.data.proveedores);
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={eliminarModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeEliminar}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-10" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-1/4 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-none">
                <div className="flex justify-center flex-col gap-2 items-center">
                  <IoIosAlert className="text-yellow-400 text-9xl py-1" />

                  <p className="text-3xl text-yellow-500">¡Espera! ✋</p>

                  <p className="font-light text-sm mt-2">
                    ¿Vas a eliminar el comprobante estás seguro?
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-5">
                    <button
                      onClick={() => closeEliminar()}
                      className="text-sm font-bold text-gray-400 hover:bg-gray-300 py-2 px-4 rounded-full hover:text-gray-600"
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        handleEliminarOrden(obtenerId), closeEliminar();
                      }}
                      className="text-base font-bold text-white bg-orange-500 hover:bg-orange-600 py-2 px-6 rounded-full hover:text-white"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
