import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useProductosContext } from "../../context/ProductosProvider";
import client from "../../api/axios";

export const ModalCrearProveedor = ({ isOpen, closeModal }) => {
  const { setProveedores } = useProductosContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-proveedor", data);

    setProveedores(res.data);

    toast.success("¡Proveedor creado correctamente!", {
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

    setTimeout(() => {
      closeModal();
    }, 500);
  });

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
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
              className="inline-block h-screen align-middle "
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
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
                  Crear nuevo proveedor
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Proveedor
                    </label>
                    <input
                      {...register("proveedor")}
                      type="text"
                      className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-sky-400 border rounded-none outline-none"
                      placeholder="DETALLE DEL PROVEEDOR"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Localidad
                    </label>
                    <input
                      {...register("localidad")}
                      type="text"
                      className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-sky-400 border rounded-none outline-none"
                      placeholder="LOCALIDAD DEL PROVEEDOR"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Provincia
                    </label>
                    <input
                      {...register("provincia")}
                      type="text"
                      className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-sky-400 border rounded-none outline-none"
                      placeholder="PROVINCIA DEL PROVEEDOR"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      class="group relative hover:bg-sky-500 hover:text-white transition-all ease-in-out bg-sky-100 text-sky-600 font-semibold uppercase text-sm py-2 px-4 rounded-xl flex items-center justify-center"
                    >
                      Crear nuevo proveedor
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-6 h-6 ml-2 icon opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>

                {/* <div className="mt-5 px-4 flex flex-col gap-2">
                  <div>
                    <p className="uppercase font-bold underline text-slate-600 text-base">
                      Proveedores creados
                    </p>
                  </div>
                  <div className="py-2 px-0 grid grid-cols-3 gap-3">
                    {proveedores.map((c) => (
                      <div
                        className="border-slate-300 border-[1px] py-2 px-3 rounded-xl flex gap-2 items-center justify-between"
                        key={c.id}
                      >
                        <p className="uppercase font-bold text-sm text-slate-600">
                          {c.proveedor}
                        </p>
                        <div className="flex gap-1">
                          <svg
                            onClick={() => handleEliminarChofer(c.id)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-10 text-red-500 bg-red-100 py-2 px-2 rounded-xl cursor-pointer"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <ModalEditarCategoriasDos
                  closeModalEditar={closeModalEditar}
                  isOpenEditar={isOpenEditar}
                  OBTENERID={OBTENERID}
                /> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
