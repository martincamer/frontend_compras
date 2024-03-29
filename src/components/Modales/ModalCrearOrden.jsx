import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { ModalSeleccionarProducto } from "./ModalSeleccionarProducto";
import { ModalEditarProductoSeleccionado } from "./ModalEditarProductoSeleccionado";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearOrden = ({ isOpen, closeModal }) => {
  const { setOrdenesMensuales } = useOrdenesContext();

  const [proveedor, setProveedor] = useState("");
  const [numero_factura, setNumeroFactura] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fecha_factura, setFechaFactura] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");

  const [socket, setSocket] = useState(null);

  const [OBTENERID, setObtenerId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const handleID = (id) => setObtenerId(id);

  const addToProductos = (
    id,
    detalle,
    categoria,
    precio_und,
    cantidad,
    totalFinal
  ) => {
    const newProducto = {
      id,
      detalle,
      categoria,
      precio_und,
      cantidad,
      totalFinal,
    };

    const productoSeleccionadoItem = productoSeleccionado.find((item) => {
      return item.id === id;
    });

    if (productoSeleccionadoItem) {
      setTimeout(() => {
        // setErrorProducto(false);
      }, 2000);
      setErrorProducto(true);
    } else {
      setProductoSeleccionado([...productoSeleccionado, newProducto]);
      // setErrorProducto(false);
    }
  };

  const deleteProducto = (id) => {
    const itemIndex = productoSeleccionado.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const newItem = [...productoSeleccionado];
      newItem.splice(itemIndex, 1); // Corrected line
      setProductoSeleccionado(newItem);
    }
  };

  useEffect(() => {
    const newSocket = io(
      //"https://tecnohouseindustrialbackend-production.up.railway.app",
      "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("crear-orden", (nuevaSalida) => {
      setOrdenesMensuales((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    // newSocket.on("crear-orden-dos", (nuevaSalida) => {
    //   setOrdenes((prevTipos) => [...prevTipos, nuevaSalida]);
    // });

    return () => newSocket.close();
  }, []);

  const totalesFinales = productoSeleccionado.reduce((total, producto) => {
    // Convert the totalFinal property to a number and add it to the accumulator
    return total + Number(producto?.totalFinal);
  }, 0); // Start with an initial value of 0

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosOrden = {
      proveedor,
      numero_factura,
      precio_final: Number(totalesFinales),
      fecha_factura,
      localidad,
      provincia,
      detalle,
      datos: { productoSeleccionado },
    };

    const res = await client.post("/crear-orden-nueva", datosOrden);
    const resDos = await client.post("/crear-orden-nueva-dos", datosOrden);

    if (socket) {
      socket.emit("crear-orden", res.data);
    }

    if (socket) {
      socket.emit("crear-orden-dos", resDos.data);
    }

    toast.success("¡Orden creada correctamente!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setTimeout(() => {
      closeModal();
    }, 500);
  };

  const [isOpenProducto, setIsOpenProducto] = useState(false);

  const openProducto = () => {
    setIsOpenProducto(true);
  };

  const closeProducto = () => {
    setIsOpenProducto(false);
  };

  const [isOpenProductoEditar, setIsOpenProductoEditar] = useState(false);

  const openProductoEditar = () => {
    setIsOpenProductoEditar(true);
  };

  const closeProductoEditar = () => {
    setIsOpenProductoEditar(false);
  };

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
              <div className="inline-block w-1/2 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  ORDEN DE COMPRA NUEVA
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        Proveedor de la orden
                      </label>
                      <input
                        value={proveedor}
                        onChange={(e) => setProveedor(e.target.value)}
                        type="text"
                        className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                        placeholder="PROVEEDOR DE LA ORDEN"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        Numero del remito
                      </label>
                      <input
                        value={numero_factura}
                        onChange={(e) => setNumeroFactura(e.target.value)}
                        type="text"
                        className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                        placeholder="NUMERO DE LA FACT O REM"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        FECHA DEL REMITO/FACT
                      </label>
                      <input
                        value={fecha_factura}
                        onChange={(e) => setFechaFactura(e.target.value)}
                        type="date"
                        className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        LOCALIDAD
                      </label>
                      <input
                        value={localidad}
                        onChange={(e) => setLocalidad(e.target.value)}
                        type="text"
                        className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                        placeholder="LOCALIDAD"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        PROVINCIA
                      </label>
                      <input
                        value={provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                        type="text"
                        className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                        placeholder="NUMERO DE LA FACT O REM"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Detallar algo mensaje,etc.
                    </label>
                    <textarea
                      value={detalle}
                      onChange={(e) => setDetalle(e.target.value)}
                      type="text"
                      placeholder="ESCRIBIR UN MENSAJE O DETALLAR ALGO."
                      className="py-2 px-4 rounded-xl border-slate-300 border-[1px] shadow uppercase placeholder:text-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openProducto()}
                      className="bg-black py-2 px-5 rounded-xl shadow text-white text-sm"
                    >
                      CARGAR PRODUCTO
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {productoSeleccionado.map((p) => (
                      <div className="border-slate-300 border-[1px] shadow py-2 px-5 rounded-xl relative">
                        <div>
                          <p className="uppercase font-bold text-slate-700 underline">
                            {p.detalle}
                          </p>
                          <p className="uppercase font-normal text-slate-700 text-sm">
                            {p.categoria}
                          </p>
                          <p className="uppercase font-bold text-slate-700 text-sm">
                            {Number(p.precio_und).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </p>
                          <p className="uppercase font-bold text-green-500  text-sm">
                            {p.cantidad}
                          </p>
                          <p className="uppercase font-normal text-slate-700 text-sm">
                            <span className="uppercase font-bold text-slate-800">
                              Total final:
                            </span>{" "}
                            {Number(p.totalFinal).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </p>
                          <div className="flex gap-2 absolute top-0 right-0 py-2 px-2">
                            <svg
                              onClick={() => {
                                handleID(p.id), openProductoEditar();
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-slate-500 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                            <svg
                              onClick={() => deleteProducto(p.id)}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-red-800 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-slate-800 text-white font-bold uppercase text-sm py-2 px-4 rounded-xl shadow"
                    >
                      CREAR NUEVA ORDEN
                    </button>
                  </div>
                </form>
                <ModalSeleccionarProducto
                  deleteProducto={deleteProducto}
                  addToProductos={addToProductos}
                  OBTENERID={OBTENERID}
                  handleID={handleID}
                  isOpen={isOpenProducto}
                  closeModal={closeProducto}
                />
                <ModalEditarProductoSeleccionado
                  productoSeleccionado={productoSeleccionado}
                  setProductoSeleccionado={setProductoSeleccionado}
                  isOpen={isOpenProductoEditar}
                  // openProductoEditar={openProductoEditar}
                  closeModal={closeProductoEditar}
                  OBTENERID={OBTENERID}
                />
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
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
