import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useProductosContext } from "../../context/ProductosProvider";
import client from "../../api/axios";

export const ModalEditarProductoSeleccionado = ({
  isOpen,
  closeModal,
  OBTENERID,
  productoSeleccionado,
  setProductoSeleccionado,
}) => {
  const [precio_und, setPrecio] = useState("");
  const [categoria, setCategorias] = useState("");
  const [detalle, setDetalle] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [iva, setIva] = useState(0);

  const { productos, setProductos } = useProductosContext();

  useEffect(() => {
    // Buscar el cliente seleccionado dentro de datosCliente
    const clienteEncontrado = productoSeleccionado.find(
      (cliente) => cliente.id === OBTENERID
    );

    // Si se encuentra el cliente, establecer los valores de los campos del formulario
    if (clienteEncontrado) {
      setPrecio(clienteEncontrado.precio_und);
      setCantidad(clienteEncontrado.cantidad);
      setCategorias(clienteEncontrado.categoria);
      setDetalle(clienteEncontrado.detalle);
      setIva(clienteEncontrado.iva);
    }
  }, [OBTENERID, productoSeleccionado]);

  const handleCliente = () => {
    const totalFinal = precio_und * cantidad;
    const totalFinalIva =
      Number(iva) === 0
        ? Number(precio_und * cantidad)
        : Number(precio_und * cantidad * iva);

    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = {
      id: OBTENERID,
      detalle,
      categoria,
      precio_und,
      cantidad,
      totalFinal,
      totalFinalIva,
      iva,
      cantidadFaltante: 0,
    };

    // Actualizar la lista de clientes con los datos actualizados
    const datosClienteActualizados = productoSeleccionado.map(
      (clienteExistente) => {
        if (clienteExistente.id === OBTENERID) {
          return clienteActualizado;
        }
        return clienteExistente;
      }
    );

    // Actualizar el estado con la lista de clientes actualizada
    setProductoSeleccionado(datosClienteActualizados);

    // Cerrar el modal después de editar el cliente
    closeModal();
  };

  const handleSubmitPrecioUnd = async () => {
    try {
      const res = await client.put(
        `/editar-producto/precio-detalle/${detalle}`,
        {
          precio_und,
        }
      );

      console.log(res);
      const productoEncontrado = productos.find(
        (producto) => producto.detalle === detalle
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[107] overflow-y-auto"
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
              <div className="inline-block w-3/4 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
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
                  EDITAR PRODUCTO SELECCIONADO
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
                  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                      <tr>
                        {/* <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          DETALLE
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CATEGORIA
                        </th> */}
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          PRECIO POR UND $
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CANTIDAD
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          SELECCIONAR IVA
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          TOTAL FINAL
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          TOTAL FINAL CON IVA
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        {/* <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.detalle}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          {producto?.categoria}
                        </td> */}
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
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                          <select
                            value={iva}
                            className="border-slate-300 py-2.5 bg-white uppercase px-4 border-[1px] rounded-xl shadow"
                            type="text"
                            onChange={(e) => setIva(Number(e.target.value))}
                          >
                            <option value={0}>NO LLEVA IVA</option>
                            <option value={1.105}>10.5</option>
                            <option value={1.21}>21.00</option>
                          </select>
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
                        <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900 uppercase">
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
                      handleCliente();
                      handleSubmitPrecioUnd();
                      //   closeModal();
                    }}
                    type="button"
                    className="bg-green-200 text-green-600 rounded-xl py-2 px-4 text-sm flex gap-2 items-center"
                  >
                    EDITAR PRODUCTO
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
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
