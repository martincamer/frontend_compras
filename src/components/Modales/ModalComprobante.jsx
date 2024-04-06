import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API

export const ModalComprobante = ({ isOpen, closeModal, datos, setDatos }) => {
  // Inicializa Cloudinary
  const cld = Cloudinary.new({
    cloud: {
      cloudName: "de4aqqalo",
    },
    apiKey: "TU_API_KEY",
    apiSecret: "TU_API_SECRET",
  });

  const { register, handleSubmit, setValue } = useForm();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setValue("params", datos.id);
    setValue("proveedor", datos.proveedor);
  }, [datos.id]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tu_upload_preset"); // Reemplaza 'tu_upload_preset' con tu propio upload preset de Cloudinary

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          cld.config().cloudName
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Error al subir la imagen", {
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

  const onSubmit = async (formData) => {
    try {
      // Enviar el formulario con la URL de la imagen actualizada
      const res = await client.post(`/crear-comprobante`, {
        ...formData,
        imageUrl,
      });

      toast.success("¡Comprobante creado correctamente!", {
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
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0" />
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="text-lg text-slate-700 mb-3 border-b-[1px] uppercase">
                Editar el producto
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="uppercase text-slate-700 text-sm"
                    htmlFor=""
                  >
                    Total Entrega
                  </label>
                  <input
                    {...register("total", { required: true })}
                    type="text"
                    className="border-slate-300 border-[1px] shadow rounded-xl w-full uppercase py-2 px-4"
                    placeholder="PONER EL TOTAL"
                  />
                </div>

                <div className="flex flex-col gap-2">
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
                </div>

                {imageUrl && (
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Imagen Subida
                    </label>
                    <AdvancedImage cldImg={imageUrl} />
                  </div>
                )}

                <div className="mt-3">
                  <button
                    className="bg-black py-2 px-4 rounded-xl shadow text-white uppercase text-sm"
                    type="submit"
                  >
                    Editar la entrega
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
  );
};
