import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API
import axios from "axios";

export const ModalComprobante = ({ isOpen, closeModal, datos }) => {
  const [params, setParams] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [total, setTotal] = useState(0);
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

      setTimeout(() => {
        location.reload();
      }, 500);
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

  // const [params, setParams] = useState("");
  // const [proveedor, setProveedor] = useState("");
  // const [total, setTotal] = useState("");
  // const [imagen, setImagen] = useState(null);

  // const uploadFile = async (type) => {
  //   const data = new FormData();
  //   data.append("file", type === "image" ? imagen : "");
  //   data.append("upload_preset", type === "image" ? "imagenes" : "-");

  //   try {
  //     // let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  //     let resourceType = type === "image" ? "image" : "video";
  //     let api = `https://api.cloudinary.com/v1_1/de4aqqalo/${resourceType}/upload`;

  //     const res = await axios.post(api, data);
  //     const { secure_url } = res.data;
  //     console.log(secure_url);
  //     return secure_url;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   setParams(datos.id);
  //   setProveedor(datos.proveedor);
  // }, [datos.id]);

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const imgUrl = await uploadFile("image");

  //   const data = {
  //     params,
  //     proveedor,
  //     total,
  //     imagen: imgUrl,
  //   };

  //   try {
  //     // Enviar el formulario con la URL de la imagen actualizada
  //     const res = await client.post(`/crear-comprobante`, data);
  //     toast.success("¡Comprobante creado correctamente espera 3 segundos!", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "light",
  //       style: {
  //         padding: "10px",
  //         background: "#b8ffb8",
  //         color: "#009900",
  //         borderRadius: "15px",
  //         boxShadow: "none",
  //       },
  //     });

  //     setTimeout(() => {
  //       location.reload();
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error al agregar el comprobante:", error);
  //     toast.error("Error al crear el comprobante", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "light",
  //       style: {
  //         padding: "10px",
  //         background: "#ffb8b8",
  //         color: "#990000",
  //         borderRadius: "15px",
  //       },
  //     });
  //   }
  // };

  // const [previewUrl, setPreviewUrl] = useState(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImagen(file);
  //     // Crear una URL para la vista previa
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl(url);
  //   }
  // };

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
              <div className="inline-block w-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl max-md:w-full max-md:h-full">
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
                      className="border-slate-300 border-[1px] shadow rounded-xl w-full uppercase py-2 px-4"
                      placeholder="PONER EL TOTAL"
                    />
                    <div className="flex">
                      <p className="bg-orange-100 py-2 px-5 rounded-xl text-orange-600 font-bold">
                        {Number(total || 0).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}{" "}
                        - TOTAL FINAL
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 rounded-xl hover:shadow-md transition-all ease-linear space-y-1 cursor-pointer">
                    <label
                      className="uppercase text-slate-700 text-sm"
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
                      className="w-full bg-slate-100 text-slate-800 py-4 px-4 rounded-xl uppercase font-bold text-sm file:bg-slate-700 file:text-white file:py-2 file:border-none file:px-3 file:rounded-xl file:shadow-md cursor-pointer"
                    />
                  </div>

                  {previewUrl && (
                    <div className="mt-2 flex flex-col gap-3">
                      <p className="uppercase text-slate-700 text-sm font-bold">
                        Vista Previa:
                      </p>
                      <div className="h-[300px] overflow-y-scroll">
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
                      className="bg-sky-400 py-2.5 px-6 rounded-full font-semibold text-white uppercase text-sm flex gap-2 items-center"
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
