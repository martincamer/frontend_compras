import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../api/axios";

export const ModalObtenerCompra = ({ isOpen, closeModal, obtenerId }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/comprobantes/${obtenerId}`);

      setDatos(res.data);
    }

    loadData();
  }, [obtenerId]);

  const [imagenAmpliada, setImagenAmpliada] = useState(false);

  const handleToggleImagenAmpliada = () => {
    setImagenAmpliada(!imagenAmpliada);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
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
            <div className=" inline-block w-1/3 max-md:w-full p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
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

              <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase font-bold pb-2 flex gap-4 items-center">
                COMPROBANTE DE PAGO NUMERO{" "}
                <span className="text-indigo-600 text-lg bg-indigo-100 py-1 px-4 rounded-xl">
                  {datos.id}
                </span>
              </div>

              <div className="py-2 flex flex-col gap-2">
                <p className="uppercase font-bold text-sm text-slate-700 flex gap-3">
                  <span className="underline"> Fecha de creación </span>
                  <span className="text-indigo-600 font-normal">
                    {datos?.created_at?.split("T")[0]}
                  </span>
                </p>

                <p className="uppercase font-bold text-sm text-slate-700 flex gap-3">
                  <span className="underline"> Proveedor </span>
                  <span className="text-indigo-600 font-normal">
                    {datos.proveedor}
                  </span>
                </p>

                <p className="uppercase font-bold text-sm text-slate-700 flex gap-3">
                  <span className="underline"> Total del comprobante </span>
                  <span className="text-indigo-600 font-bold">
                    {Number(datos.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </p>

                <div className="h-[300px] overflow-y-scroll">
                  <img
                    src={datos.imagen}
                    className="h-[600px] w-full rounded-2xl shadow"
                  />
                </div>

                {imagenAmpliada ? (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={datos.imagen}
                        alt="Imagen ampliada"
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <button
                      className="absolute top-4 right-4 bg-red-100 text-red-800 py-3 px-5 rounded-xl text-xl focus:outline-none"
                      onClick={handleToggleImagenAmpliada}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : null}
                <div>
                  <button
                    onClick={handleToggleImagenAmpliada}
                    className="text-sm text-green-700 bg-green-100 py-2 px-4 rounded-xl flex gap-2 items-center"
                  >
                    VER COMPROBANTE IMAGEN GRANDE.
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
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
