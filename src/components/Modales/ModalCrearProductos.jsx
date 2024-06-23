import { Dialog, Menu, Transition } from "@headlessui/react";
import { useProductosContext } from "../../context/ProductosProvider";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import client from "../../api/axios";
import { ModalNuevaCategoria } from "./ModalNuevaCategoria";

export const ModalCrearProductos = ({ isOpen, closeModal }) => {
  const [precio_und, setPrecio] = useState("");
  const [detalle, setDetale] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [categoria, setCategoria] = useState("");

  const { categorias, setProductos } = useProductosContext();

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosProducto = { precio_und, detalle, proveedor: "", categoria };

    try {
      const res = await client.post("/crear-producto", datosProducto);

      setProductos(res.data);

      setPrecio("");
      setDetale("");
      setProveedor("");
      setCategoria("");

      toast.success("¡Producto creado correctamente!", {
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
          boxShadow: "none",
          borderRadius: "15px",
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
            <div className="fixed inset-0 bg-black bg-opacity-40" />
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
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

                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
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
                      className="py-2 px-4 font-semibold uppercase text-sm border border-sky-300 outline-none"
                      placeholder="DETALLE DEL PRODUCTO"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Seleccionar categoria
                    </label>
                    <div className="flex gap-2 items-center">
                      <select
                        type="text"
                        className="py-2 px-4 font-semibold uppercase text-sm border border-sky-300 outline-none w-full"
                        onChange={(e) => setCategoria(e.target.value)}
                        value={categoria}
                      >
                        <option
                          className="uppercase font-bold text-sky-500"
                          value=""
                        >
                          Seleccionar la categoria
                        </option>
                        {categorias.map((c) => (
                          <option className="font-semibold" key={c.id}>
                            {c.detalle}
                          </option>
                        ))}
                      </select>
                      <div
                        onClick={() =>
                          document
                            .getElementById("my_modal_categoria")
                            .showModal()
                        }
                        className="cursor-pointer"
                      >
                        <IoMdAdd className="text-3xl border border-sky-300 py-0.5 px-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-700 uppercase">
                      Precio
                    </label>
                    <div className="py-2 px-4 font-semibold uppercase text-sm border border-sky-300 outline-none flex gap-2">
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
                      <span className="bg-sky-100 text-sm font-semibold py-2 px-6 rounded uppercase  text-sky-600">
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
                      className="bg-sky-400 py-2 px-8 font-semibold hover:bg-orange-500 transition-all rounded-full text-white uppercase text-xs"
                    >
                      Crear nuevo producto
                    </button>
                  </div>
                </form>

                <ModalNuevaCategoria />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
