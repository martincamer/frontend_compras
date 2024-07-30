import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../api/axios";

export const ModalVerProductos = ({
  isOpen,
  closeModal,
  obtenerId,
  setIsOpen,
}) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/orden/${obtenerId}`);
      setDatos(respuesta.data);
    }

    loadData();
  }, [obtenerId]);

  return (
    <>
      <Menu as="div" className="z-50">
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 h-full"
            onClose={() => {}}
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
                <div className="inline-block w-2/3 max-md:w-full p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-md scrollbar-hidden">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-2 py-2 text-sm text-gray-800 bg-gray-200/80 border border-transparent rounded-full hover:bg-gray-300 duration-300 cursor-pointer max-md:text-xs"
                      onClick={closeModal}
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

                  <div className="max-md:overflow-x-auto mx-5 max-md:mx-0 max-md:my-5 my-10 scrollbar-hidden">
                    <table className="table">
                      <thead className="text-left font-bold text-gray-900 text-sm">
                        <tr>
                          <th>Detalle</th>
                          <th>Categoria</th>
                          <th>Cantidad</th>
                          <th>Precio und</th>
                          <th>Precio total Sin Iva</th>
                          <th>Iva Seleccionado</th>
                          <th>Precio total Con Iva</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs capitalize font-medium">
                        {datos?.datos?.productoSeleccionado.map((p) => (
                          <tr key={p.id}>
                            <td>{p.detalle}</td>
                            <td>{p.categoria}</td>
                            <td>{p.cantidad}</td>
                            <td>
                              {" "}
                              {Number(p.precio_und).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </td>
                            <td className="text-white">
                              <div className="flex">
                                <p className="bg-green-500/90 py-1 px-4 rounded-md">
                                  {Number(p.totalFinal).toLocaleString(
                                    "es-AR",
                                    {
                                      style: "currency",
                                      currency: "ARS",
                                    }
                                  )}
                                </p>
                              </div>
                            </td>
                            <td className=" px-4 py-4 text-gray-700 uppercase text-sm">
                              {(p.iva === 1.105 && "IVA DEL 10.05") ||
                                (p.iva === 1.21 && "IVA DEL 21.00") ||
                                (p.iva === 0 && "NO TIENE IVA")}
                            </td>
                            <td className="text-white">
                              <div className="flex">
                                <p className="bg-primary py-1 px-4 rounded-md">
                                  {Number(p.totalFinalIva).toLocaleString(
                                    "es-AR",
                                    {
                                      style: "currency",
                                      currency: "ARS",
                                    }
                                  )}
                                </p>
                              </div>
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
    </>
  );
};
