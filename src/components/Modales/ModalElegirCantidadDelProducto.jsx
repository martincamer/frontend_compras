import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../api/axios";
import { useProductosContext } from "../../context/ProductosProvider";

export const ModalElegirCantidadDelProducto = ({
  isOpen,
  closeModal,
  OBTENERID,
  addToProductos,
}) => {
  const { productos, setProductos } = useProductosContext();

  const [producto, setProducto] = useState([]);
  const [precio_und, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [iva, setIva] = useState(0);

  const handleSubmitPrecioUnd = async () => {
    const res = await client.put(`/editar-producto/precio/${OBTENERID}`, {
      precio_und,
    });

    const productoEncontrado = productos.find(
      (producto) => producto.id === OBTENERID
    );

    if (!productoEncontrado) {
      console.error("Producto no encontrado");
      return;
    }

    // Actualizar solo el campo precio_und del producto encontrado
    const productoActualizado = {
      ...productoEncontrado,
      precio_und: precio_und,
    };

    // Crear un nuevo array de productos con el producto actualizado
    const nuevosProductos = productos.map((producto) =>
      producto.id === productoActualizado.id ? productoActualizado : producto
    );

    // Actualizar el estado de productos con el nuevo array que incluye el producto actualizado
    setProductos(nuevosProductos);
  };

  useEffect(() => {
    async function laodData() {
      const res = await client.get(`/producto/${OBTENERID}`);

      setProducto(res.data);
      setPrecio(res.data.precio_und);
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
          className="fixed inset-0 z-[105] overflow-y-auto"
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
              <div className="inline-block w-5/6 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-none">
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
                  PRODUCTO SELECCIONADO
                </div>

                <div className="border border-sky-300 rounded-none">
                  <table className="table">
                    <thead className="">
                      <tr>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          DETALLE
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CATEGORIA
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          PRECIO POR UND $
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CANTIDAD
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          SELECCIONAR IVA
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          TOTAL FINAL
                        </th>
                        <th className="px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          TOTAL FINAL CON IVA
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr key={producto.id}>
                        <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.detalle}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.categoria}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                          <input
                            value={precio_und}
                            className="py-2 px-4 border border-sky-300 shadow-none outline-none"
                            type="text"
                            onChange={(e) => setPrecio(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                          <input
                            value={cantidad}
                            className="py-2 px-4 border border-sky-300 shadow-none outline-none"
                            type="text"
                            onChange={(e) => setCantidad(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                          <select
                            value={iva}
                            className="py-2 px-4 border border-sky-300 shadow-none outline-none"
                            type="text"
                            onChange={(e) => setIva(Number(e.target.value))}
                          >
                            <option value={0}>NO LLEVA IVA</option>
                            <option value={1.105}>10.5</option>
                            <option value={1.21}>21.00</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                          {Number(precio_und * cantidad).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                          {iva === 0
                            ? Number(precio_und * cantidad).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )
                            : Number(
                                Number(precio_und * cantidad) * iva
                              ).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
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
                        Number(precio_und * cantidad),
                        Number(iva) === 0
                          ? Number(precio_und * cantidad)
                          : Number(precio_und * cantidad * iva), // Usar precio_und * cantidad si el IVA es cero
                        Number(iva)
                      );
                      handleSubmitPrecioUnd();
                      closeModal();
                    }}
                    type="button"
                    className="bg-sky-400 text-white hover:bg-orange-500 transition-all font-semibold rounded-full capitalize py-1.5 px-4 text-sm flex gap-2 items-center"
                  >
                    CREAR EL PRODUCTO/ORDEN
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>

                {/* <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div> */}

                <ModalElegirCantidadDelProducto />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
