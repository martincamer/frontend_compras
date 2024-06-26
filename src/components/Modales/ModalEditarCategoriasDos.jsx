import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import client from "../../api/axios";
import io from "socket.io-client";
import { useProductosContext } from "../../context/ProductosProvider";

export const ModalEditarCategoriasDos = ({
  isOpenEditar,
  closeModalEditar,
  OBTENERID,
}) => {
  const { register, handleSubmit, setValue } = useForm();

  const { setProveedores, proveedores } = useProductosContext();

  const [socket, setSocket] = useState(null);
  // const [datos, setDatos] = useState("");

  useEffect(() => {
    const newSocket = io(
      /*"http://localhost:4000"¨*/ "https://backendcompras-production.up.railway.app",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/proveedor/${OBTENERID}`);

      setValue("proveedor", res.data.proveedor);
      setValue("total", res.data.total);

      setValue(res.data.id);
    }
    loadData();
  }, [OBTENERID]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/editar-proveedor/${OBTENERID}`, data);

    if (socket) {
      socket.emit("editar-proveedor", res);
    }

    toast.success("¡Proveedor editada correctamente!", {
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
      },
    });

    setTimeout(() => {
      closeModalEditar();
    }, 500);
  });

  useEffect(() => {
    const newSocket = io(
      //   "https://tecnohouseindustrialbackend-production.up.railway.app",
      "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    const handleEditarSalida = (editarSalida) => {
      const updateSalida = JSON.parse(editarSalida?.config?.data);

      setProveedores((prevSalidas) => {
        const nuevosDatos = [...prevSalidas];

        const index = nuevosDatos.findIndex(
          (salida) => salida.id === OBTENERID
        );
        nuevosDatos[index] = {
          id: nuevosDatos[index]?.id,
          proveedor: updateSalida?.proveedor,
          total: nuevosDatos[index]?.total,
          created_at: nuevosDatos[index]?.created_at,
          updated_at: nuevosDatos[index]?.updated_at,
        };
        return nuevosDatos;
      });
    };

    newSocket.on("editar-proveedor", handleEditarSalida);

    return () => {
      newSocket.off("editar-proveedor", handleEditarSalida);
      newSocket.close();
    };
  }, []);

  return (
    <Transition appear show={isOpenEditar} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModalEditar}
      >
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
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-10" />
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
            <div className="inline-block w-1/3 max-md:w-full p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                  onClick={closeModalEditar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase font-bold">
                Editar Proveedor
              </div>
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-slate-700 uppercase">
                    Proveedor
                  </label>
                  <input
                    {...register("proveedor")}
                    type="text"
                    className="uppercase py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                    placeholder="NOMBRE Y APELLIDO DEL PROVEEDOR"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    class="group relative hover:bg-indigo-500 hover:text-white transition-all ease-in-out bg-indigo-100 text-indigo-600 font-normal uppercase text-sm py-2 px-4 rounded-xl flex items-center justify-center"
                  >
                    Editar categoria
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      class="w-6 h-6 ml-2 icon opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
              {/* <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                  onClick={closeModalEditar}
                >
                  Cerrar Ventana
                </button>
              </div> */}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
