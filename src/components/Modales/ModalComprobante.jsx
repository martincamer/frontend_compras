import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API
import axios from "axios";
import { useProductosContext } from "../../context/ProductosProvider";

export const ModalComprobante = ({
  isOpen,
  closeModal,
  datos,
  setComprobantes,
  setDatos,
}) => {
  const [params, setParams] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [total, setTotal] = useState(0);
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { setProveedores } = useProductosContext();

  useEffect(() => {
    setParams(datos.id);
    setProveedor(datos.proveedor);
  }, [datos.id]);

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", archivo);
    data.append("upload_preset", type === "image" ? "imagenes" : "documentos");

    try {
      const resourceType = type === "image" ? "image" : "raw";
      const api = `https://api.cloudinary.com/v1_1/de4aqqalo/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const fileType = archivo?.type?.startsWith("image/")
      ? "image"
      : archivo?.type === "application/pdf"
      ? "pdf"
      : "video";
    const imgUrl = await uploadFile(fileType);

    const data = {
      params,
      proveedor,
      total,
      imagen: imgUrl,
    };

    try {
      const res = await client.post(`/crear-comprobante`, data);

      console.log(res.data);

      setComprobantes(res.data.comprobantes);
      setProveedores(res.data.proveedores);

      setDatos(res.data.proveedorActualizado);

      toast.success("¡Comprobante creado correctamente espera 3 segundos!", {
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

      closeModal();
    } catch (error) {
      console.error("Error al agregar el comprobante:", error);
      toast.error("Error al crear el comprobante", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffb8b8",
          color: "#990000",
          borderRadius: "15px",
        },
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center ">
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
              className="inline-block h-screen align-middle max-md:h-full max-md:w-full"
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
              <div className="inline-block w-1/3 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-none max-md:w-full max-md:h-full">
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                  CARGAR NUEVO COMPROBANTE DE PAGO
                </div>

                <form
                  encType="multipart/form-data"
                  onSubmit={onSubmit}
                  className="px-4 py-4"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Total del comprobante/entrega
                    </label>
                    <input
                      onChange={(e) => setTotal(e.target.value)}
                      type="text"
                      className="border-sky-300 border py-2 px-3 font-semibold text-sm outline-none"
                      placeholder="PONER EL TOTAL"
                    />
                    <div className="flex">
                      <p className="bg-orange-100 py-2 px-5 rounded text-orange-600 font-bold">
                        {Number(total || 0).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}{" "}
                      </p>
                    </div>
                  </div>

                  <div className="border border-sky-300 py-2 px-3 mt-4">
                    <label
                      className="uppercase text-slate-700 text-sm font-semibold"
                      htmlFor="fileUpload"
                    >
                      Comprobante
                    </label>
                    <br />
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      id="fileUpload"
                      onChange={handleFileChange}
                      className="w-full file-input file-input-info bg-sky-100"
                    />
                  </div>

                  {previewUrl && (
                    <div className="mt-2 flex flex-col gap-3">
                      <p className="uppercase text-slate-700 text-sm font-bold">
                        Vista Previa:
                      </p>
                      <div className="h-[300px] overflow-y-scroll scroll-bar px-2">
                        {archivo?.type?.startsWith("image/") ? (
                          <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="h-[600px] w-full shadow"
                          />
                        ) : archivo?.type === "application/pdf" ? (
                          <iframe
                            src={previewUrl}
                            className="h-[600px] w-full shadow"
                            title="Vista previa PDF"
                          />
                        ) : (
                          <video
                            src={previewUrl}
                            controls
                            className="h-[600px] w-full rounded-2xl shadow"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <button
                      className="bg-sky-400 py-2 text-xs px-6 rounded-full font-semibold text-white uppercase flex gap-2 items-center hover:bg-orange-500 transition-all"
                      type="submit"
                    >
                      CREAR COMPROBANTE
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
                          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                        />
                      </svg>
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
