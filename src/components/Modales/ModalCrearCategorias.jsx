import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useProductosContext } from "../../context/ProductosProvider";
import { ModalEditarCategorias } from "./ModalEditarCategorias";
import client from "../../api/axios";

export const ModalCrearCategorias = ({
  isOpenCategorias,
  closeModalCategorias,
}) => {
  const { setCategorias, categorias } = useProductosContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [OBTENERID, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-categoria", data);

    setCategorias(res.data);

    toast.success("¡Categoria creada correctamente!", {
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
      closeModalCategorias();
    }, 500);
  });

  const [isOpenEditar, setIsOpenEditar] = useState(false);

  const openEditar = () => {
    setIsOpenEditar(true);
  };
  const closeEditar = () => {
    setIsOpenEditar(false);
  };

  const handleEliminarChofer = async (id) => {
    const res = await client.delete(`/eliminar-categoria/${id}`);

    setCategorias(res.data);

    toast.error("¡Categoria eliminada correctamente!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        padding: "10px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "15px",
      },
    });
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenCategorias} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalCategorias}
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
              <div className="inline-block w-1/2 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-full hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalCategorias}
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
                  Crear nueva categoria
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Detalle de la Categoria
                    </label>
                    <input
                      {...register("detalle")}
                      type="text"
                      className="py-2 px-4 font-semibold uppercase text-sm border border-sky-300 outline-none w-1/4"
                      placeholder="DETALLE DE LA CATEGORIA"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative transition-all ease-in-out bg-sky-400 text-white uppercase font-semibold py-2 text-xs text-center px-4 rounded-full flex items-center justify-center"
                    >
                      Crear nueva categoria
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 ml-2 icon opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

                <div className="mt-5 px-4 flex flex-col gap-2">
                  <div>
                    <p className="uppercase font-bold underline text-slate-600 text-base">
                      Categorias creadas
                    </p>
                  </div>
                  <div className="py-2 px-0 grid grid-cols-3 gap-3">
                    {categorias.map((c) => (
                      <div
                        className="border-slate-300 border-[1px] py-2 px-3 rounded-xl flex gap-2 items-center justify-between"
                        key={c.id}
                      >
                        <p className="uppercase font-bold text-sm text-slate-600">
                          {c.detalle}
                        </p>
                        <div className="flex gap-1">
                          <svg
                            onClick={() => {
                              handleID(c.id), openEditar();
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-10 text-sky-500 bg-sky-100 py-2 px-2 rounded-xl cursor-pointer"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>

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

                <ModalEditarCategorias
                  closeModalEditar={closeEditar}
                  isOpenEditar={isOpenEditar}
                  OBTENERID={OBTENERID}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
