import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import client from "../../api/axios";
import io from "socket.io-client";
import { useProductosContext } from "../../context/ProductosProvider";

export const ModalEditarCategorias = ({
  isOpenEditar,
  closeModalEditar,
  OBTENERID,
}) => {
  const { register, handleSubmit, setValue } = useForm();

  const { setCategorias } = useProductosContext();

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/categoria/${OBTENERID}`);

      setValue("detalle", res.data.detalle);

      setDatos(res.data.id);
    }
    loadData();
  }, [OBTENERID]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/editar-categoria/${datos}`, data);

    setCategorias(res.data);

    toast.success("¡Categoria editada correctamente!", {
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
            <div className="inline-block w-1/4 max-md:w-full p-6 my-8 text-left align-middle transition-all transform bg-white rounded-none">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-full hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                  onClick={closeModalEditar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
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
                Editar categoría
              </div>
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-slate-700 uppercase">
                    Categoria
                  </label>
                  <input
                    {...register("detalle")}
                    type="text"
                    className="py-2 px-4 font-semibold uppercase text-sm border border-blue-500 rounded outline-none"
                    placeholder="DETALLE DE LA CATEGORIA"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative bg-blue-500 hover:bg-orange-500 text-white transition-all ease-in-out uppercase text-xs font-semibold py-2 px-4 rounded-full flex items-center justify-center"
                  >
                    Editar categoria
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
