import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../api/axios";

export const ModalElegirCantidadDelProducto = ({
  isOpen,
  closeModal,
  OBTENERID,
  addToProductos,
}) => {
  const [producto, setProducto] = useState([]);

  const [precio_und, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  // const [totalFinal, setTotalFinal] = useState("");

  useEffect(() => {
    async function laodData() {
      const res = await client.get(`/producto/${OBTENERID}`);

      setProducto(res.data);
      setPrecio(res.data.precio_und);
      // setTotalFinal(precio_und * cantidad);
    }

    setCantidad("");

    laodData();
  }, [OBTENERID]);

  // Función para generar un ID numérico aleatorio
  function generarID() {
    return Math.floor(Math.random() * 1000000).toString(); // Genera un número aleatorio de hasta 6 dígitos
  }

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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <div className="inline-block w-3/4 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  PRODUCTO SELECCIONADO
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
                  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          DETALLE
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CATEGORIA
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          PRECIO POR UND $
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CANTIDAD
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          TOTAL FINAL
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      <tr key={producto.id}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.detalle}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.categoria}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          <input
                            value={precio_und}
                            className="border-slate-300 py-2 px-4 border-[1px] rounded-xl shadow"
                            type="text"
                            onChange={(e) => setPrecio(e.target.value)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          <input
                            value={cantidad}
                            className="border-slate-300 py-2 px-4 border-[1px] rounded-xl shadow"
                            type="text"
                            onChange={(e) => setCantidad(e.target.value)}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900 uppercase">
                          {Number(precio_und * cantidad).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      const randomID = generarID();
                      addToProductos(
                        parseInt(`${producto?.id}${randomID}`, 10), // Combina el ID del producto con el ID aleatorio
                        producto?.detalle,
                        producto?.categoria,
                        precio_und,
                        cantidad,
                        precio_und * cantidad
                      );
                      closeModal();
                    }}
                    type="button"
                    className="bg-green-500 text-white rounded-xl shadow py-2 px-4 text-sm"
                  >
                    CREAR EL PRODUCTO/ORDEN
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>

                <ModalElegirCantidadDelProducto />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
