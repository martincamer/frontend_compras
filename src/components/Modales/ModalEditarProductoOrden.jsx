import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API

export const ModalEditarProductoOrden = ({
  isOpen,
  closeModal,
  idOrden,
  idProducto,
}) => {
  const [producto, setProducto] = useState([]);

  const [cantidad, setCantidad] = useState("");
  const [cantidadFaltante, setCantidadFaltante] = useState("");
  const [categoria, setCategoria] = useState("");
  const [detalle, setDetalle] = useState("");
  const [precio_und, setPrecioUnd] = useState("");

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await client.get(
          `/orden/${idOrden}/producto/${idProducto}`
        );

        setProducto(response.data);
        setCantidad(response.data.cantidad);
        setCantidadFaltante(response.data.cantidadFaltante);
        setCategoria(response.data.categoria);
        setDetalle(response.data.detalle);
        setPrecioUnd(response.data.precio_und);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    obtenerProducto();
  }, [idOrden, idProducto]);

  const totalFinal = precio_und * cantidad;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.put(
        `/orden/${idOrden}/producto/${idProducto}`,
        {
          detalle,
          categoria,
          precio_und,
          cantidad,
          totalFinal,
        }
      );

      closeModal();

      toast.success("¡Producto editado correctamente!", {
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
          borderRadius: "15px",
          boxShadow: "none",
        },
      });

      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error al editar el producto:", error);
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

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl ">
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
                <form onSubmit={handleSubmit} className="text-sm space-y-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase">
                      Editar el detalle
                    </label>
                    <input
                      placeholder="editar el detalle"
                      type="text"
                      className="border-[1px] border-slate-300 hover:shadow transition-all ease-linear rounded-xl py-2 px-3 uppercase"
                      value={detalle}
                      onChange={(e) => setDetalle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase">
                      Editar la categoria
                    </label>
                    <input
                      placeholder="editar el detalle"
                      type="text"
                      className="border-[1px] border-slate-300 hover:shadow transition-all ease-linear rounded-xl py-2 px-3 uppercase"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase">
                      Editar el precio und
                    </label>
                    <div className="flex gap-2">
                      <input
                        placeholder="editar el precio"
                        type="text"
                        className="border-[1px] border-slate-300 hover:shadow transition-all ease-linear rounded-xl py-2 px-3 uppercase"
                        value={precio_und}
                        onChange={(e) => setPrecioUnd(e.target.value)}
                      />
                      <p className="text-green-700 bg-green-100 py-2 px-4 rounded-xl">
                        {Number(precio_und).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase">
                      Editar la cantidad
                    </label>
                    <div className="flex gap-2">
                      <input
                        placeholder="editar el precio"
                        type="text"
                        className="border-[1px] border-slate-300 hover:shadow transition-all ease-linear rounded-xl py-2 px-3 uppercase"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                      />
                      <p className="text-green-700 bg-green-100 py-2 px-4 rounded-xl">
                        {Number(totalFinal).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button className="uppercase bg-indigo-100 text-indigo-700 rounded-xl py-3 px-5">
                      Editar producto
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
