import { Dialog, Menu, Transition } from "@headlessui/react";
import { useProductosContext } from "../../context/ProductosProvider";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearProductos = ({ isOpen, closeModal }) => {
  const [precio_und, setPrecio] = useState("");
  const [detalle, setDetale] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [socket, setSocket] = useState(null);

  const { categorias, setProductos } = useProductosContext();

  useEffect(() => {
    const newSocket = io(
      "https://backendcompras-production.up.railway.app",
      // import.meta.env.BACKEND_URL,
      // "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    // showSuccess();

    newSocket.on("crear-producto", (nuevaSalida) => {
      setProductos((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosProducto = { precio_und, detalle, proveedor, categoria };

    try {
      const res = await client.post("/crear-producto", datosProducto);

      if (socket) {
        socket.emit("crear-producto", res.data);
      }
      // Limpiar los campos después de enviar los datos
      setPrecio("");
      setDetale("");
      setProveedor("");
      setCategoria("");

      toast.success("¡Producto creado correctamente!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#b8ffb8",
          color: "#009900",
        },
      });

      closeModal();
    } catch (error) {
      console.error("Error al enviar el producto:", error);
    }
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  Crear nuevo producto
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Detalle del producto
                    </label>
                    <input
                      onChange={(e) => setDetale(e.target.value)}
                      value={detalle}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="DETALLE DEL PRODUCTO"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Seleccionar categoria
                    </label>
                    <select
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow bg-white placeholder:text-slate-300 text-sm uppercase"
                      onChange={(e) => setCategoria(e.target.value)}
                      value={categoria}
                    >
                      <option className="uppercase" value="">
                        Seleccionar la categoria
                      </option>
                      {categorias.map((c) => (
                        <option key={c.id}>{c.detalle}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Proveedor
                    </label>
                    <input
                      onChange={(e) => setProveedor(e.target.value)}
                      value={proveedor}
                      type="text"
                      className="py-2 px-4 rounded-xl uppercase border-slate-300 border-[1px] shadow placeholder:text-slate-300 text-sm"
                      placeholder="DETALLE DEL PRODUCTO"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Precio
                    </label>
                    <div className="py-2 px-6 rounded-xl uppercase border-slate-300 border-[1px] shadow flex gap-4 ">
                      <span className="text-lg text-slate-700">$</span>
                      <input
                        onChange={(e) => setPrecio(e.target.value)}
                        value={precio_und}
                        type="text"
                        className=" placeholder:text-slate-300 text-sm outline-none"
                        placeholder="PRECIO POR UND"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="bg-black text-sm py-2 px-6 rounded-xl uppercase shadow text-white">
                        {Number(precio_und).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-black py-2 px-6 shadow rounded-xl text-white uppercase text-sm"
                    >
                      Crear nuevo producto
                    </button>
                  </div>
                </form>

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
