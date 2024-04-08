import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API

export const ModalComprobante = ({ isOpen, closeModal, datos, setDatos }) => {
  const [params, setParams] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    setParams(datos.id);
    setProveedor(datos.proveedor);
  }, [datos.id]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      params,
      proveedor,
      total,
      imagen: "",
    };

    try {
      // Enviar el formulario con la URL de la imagen actualizada
      const res = await client.post(`/crear-comprobante`, data);

      console.log(res.data);

      toast.success("¡Comprobante creado correctamente espera 3 segundos!", {
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

      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error al agregar el comprobante:", error);
      toast.error("Error al crear el comprobante", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffb8b8",
          color: "#990000",
        },
      });
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
            <div className="fixed inset-0 bg-black bg-opacity-5" />
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
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl border-slate-300 border-[1px]">
                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                  CARGAR NUEVO COMPROBANTE DE PAGO
                </div>

                <form onSubmit={onSubmit} className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Total Entrega
                    </label>
                    <input
                      onChange={(e) => setTotal(e.target.value)}
                      type="text"
                      className="border-slate-300 border-[1px] shadow rounded-xl w-full uppercase py-2 px-4"
                      placeholder="PONER EL TOTAL"
                    />
                    <p className="bg-orange-500 py-2 px-5 rounded-xl text-white font-bold">
                      {Number(total || 0).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}{" "}
                      - TOTAL FINAL
                    </p>
                  </div>

                  {/* <div className="flex flex-col gap-2">
                  <label
                    className="uppercase text-slate-700 text-sm"
                    htmlFor=""
                  >
                    Imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="border-slate-300 border-[1px] shadow rounded-xl w-full uppercase py-2 px-4"
                    onChange={handleImageUpload}
                  />
                </div> */}

                  {/* {imageUrl && (
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Imagen Subida
                    </label>
                    <AdvancedImage cldImg={imageUrl} />
                  </div>
                )} */}

                  <div className="mt-3">
                    <button
                      className="bg-black py-2 px-4 rounded-xl shadow text-white uppercase text-sm"
                      type="submit"
                    >
                      CREAR COMPROBANTE
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
