import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../api/axios";

export const ModalVerProductos = ({ isOpen, closeModal, obtenerId }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/orden/${obtenerId}`);
      setDatos(respuesta.data);
    }

    loadData();
  }, [obtenerId]);

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
              <div className="inline-block w-1/2 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
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

                <div className="py-2 px-2">
                  <p className="text-sm uppercase font-bold text-slate-700">
                    PRODUCTOS DE LA ORDEN DE COMPRA
                  </p>
                </div>
                <div className="border-[1px] border-slate-300 rounded-2xl hover:shadow-md transition-all ease-linear mt-6 mx-5">
                  <table className="min-w-full divide-y-2 divide-gray-200 text-sm cursor-pointer">
                    <thead className="text-left">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                          Detalle
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                          Categoria
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                          Cantidad
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                          Precio und
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                          Precio total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {datos?.datos?.productoSeleccionado.map((p) => (
                        <tr key={p.id}>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm font-bold">
                            {p.detalle}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                            {p.categoria}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                            {p.cantidad}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                            {Number(p.precio_und).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-green-700 uppercase text-sm font-bold flex">
                            <p className="bg-green-100 py-2 px-5 rounded-xl">
                              {Number(p.totalFinal).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
