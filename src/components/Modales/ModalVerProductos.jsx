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
                <div className="inline-block w-2/3 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl max-md:hidden">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-full hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
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
                            Precio total Sin Iva
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Iva Seleccionado
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Precio total Con Iva
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {datos?.datos?.productoSeleccionado.map((p) => (
                          <tr key={p.id}>
                            <td className=" px-4 py-4 text-gray-700 uppercase text-sm font-bold">
                              {p.detalle}
                            </td>
                            <td className=" px-4 py-4 text-gray-700 uppercase text-sm">
                              {p.categoria}
                            </td>
                            <td className=" px-4 py-4 text-gray-700 uppercase text-sm">
                              {p.cantidad}
                            </td>
                            <td className=" px-4 py-4 text-gray-700 uppercase text-sm">
                              {Number(p.precio_und).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </td>
                            <td className="px-4 py-4 text-white uppercase text-sm font-bold">
                              <div className="flex">
                                <p className="bg-green-500/90 py-2 px-5 rounded-full">
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
                            <td className="px-4 py-4 text-white uppercase text-sm font-bold ">
                              <div className="flex">
                                <p className="bg-orange-500/90 py-2 px-5 rounded-full">
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
      <Menu as="div" className="z-50 md:hidden">
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 max-md:block md:hidden h-full" // Asegúrate de cubrir toda la pantalla
            static
            onClose={() => {}}
          >
            <div className="flex items-center justify-center h-full md:hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="w-full h-full bg-white overflow-auto scrollbar-hidden">
                  {" "}
                  <div className="flex justify-end py-4 px-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-2 py-2 text-sm text-sky-500 bg-sky-100 border border-transparent rounded-full cursor-pointer"
                      onClick={closeModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Contenido del modal */}
                  <div className="overflow-y-auto h-full">
                    {" "}
                    {/* Permite el scroll vertical */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-slate-600">
                        Productos de la Orden
                      </h3>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {" "}
                      {/* Layout de tarjetas responsivo */}
                      {datos?.datos?.productoSeleccionado.map((product) => (
                        <div className="bg-white p-6 border border-gray-200">
                          <h3 className="font-bold text-base text-slate-700 mb-2 capitalize">
                            {product.detalle}
                          </h3>
                          <p className="text-slate-600 text-sm capitalize">
                            Categoría: {product.categoria}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Cantidad: {product.cantidad}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Iva seleccionado:{" "}
                            {(product.iva === 1.105 && "Iva del 10.05") ||
                              (product.iva === 1.21 && "Iva del 21.00") ||
                              (product.iva === 0 && "No tiene iva")}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Precio por unidad:{" "}
                            <span className="font-semibold text-slate-700">
                              {Number(product.precio_und).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )}
                            </span>
                          </p>
                          <div className="flex mt-2">
                            <p className="bg-orange-500/90 py-2 px-5 rounded-xl text-xs font-bold text-white">
                              {Number(product.totalFinalIva).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
