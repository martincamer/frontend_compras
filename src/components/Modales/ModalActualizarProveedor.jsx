import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useProductosContext } from "../../context/ProductosProvider";
import { useForm } from "react-hook-form";
import client from "../../api/axios";
import { formatearDinero } from "../../helpers/formatearDinero";
import { showSuccessToast } from "../../helpers/toast";

export const ModalActualizarProveedor = ({ idObtenida }) => {
  const { setProveedores } = useProductosContext();

  const { handleSubmit, register, setValue, watch } = useForm();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/proveedor/${idObtenida}`);
      setValue("proveedor", respuesta.data.proveedor);
      setValue("localidad", respuesta.data.localidad);
      setValue("provincia", respuesta.data.provincia);
      setValue("total", respuesta.data.total);
      setValue("numero_cuenta", respuesta.data.numero_cuenta);
      setValue("cuit", respuesta.data.cuit);
      setValue("razon_social", respuesta.data.razon_social);
      setValue("cbu", respuesta.data.cbu);
      setValue("alias", respuesta.data.alias);
      setValue("telefono", respuesta.data.telefono);
    }

    loadData();
  }, [idObtenida]);

  console.log(idObtenida);

  const onSubmit = async (formData) => {
    let proveedorData = {
      ...formData,
    };

    try {
      const res = await client.put(
        `/editar-proveedor/${idObtenida}`,
        proveedorData
      );
      setProveedores(res.data);

      document.getElementById("my_modal_editar_proveedor").close();

      showSuccessToast("Proveedor actualizado");
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const total = watch("total");

  return (
    <dialog id="my_modal_editar_proveedor" className="modal">
      <div className="modal-box rounded-md max-w-2xl max-md:h-full max-md:max-h-full max-md:max-w-full max-md:rounded-none max-md:w-full">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost  absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 mt-3"
        >
          <div className="">
            <div>
              <p className="font-bold text-lg">Datos del proveedor</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Proveedor</label>
                <input
                  placeholder="Escribir el proveedor"
                  {...register("proveedor")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Localidad</label>
                <input
                  placeholder="Escribir la localidad"
                  {...register("localidad")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Provincia</label>
                <input
                  placeholder="Escribir la provincia"
                  {...register("provincia")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Telefono</label>
                <input
                  placeholder="Escribir el telefono"
                  {...register("telefono")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="">
            <div>
              <p className="font-bold text-lg">Datos bancarios</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Numero de cuenta</label>
                <input
                  placeholder="Escribir el numero"
                  {...register("numero_cuenta")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Cuit</label>
                <input
                  placeholder="Escribir el cuit"
                  {...register("cuit")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Razón social</label>
                <input
                  placeholder="Escribir la razon social"
                  {...register("razon_social")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Cbu</label>
                <input
                  placeholder="Escribir el cbu"
                  {...register("cbu")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm">Alias</label>
                <input
                  placeholder="Escribir el alias"
                  {...register("alias")}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1">
            <div onClick={handleInputClick}>
              {isEditable ? (
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Deuda actual</label>
                  <input
                    {...register("total")}
                    onBlur={() => {
                      setIsEditable(false);
                    }}
                    type="text"
                    className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Deuda actual</label>

                  <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                    {formatearDinero(Number(total) || 0)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar el proveedor
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
