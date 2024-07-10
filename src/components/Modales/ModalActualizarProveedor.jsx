import { toast } from "react-toastify";
import { useEffect } from "react";
import { useProductosContext } from "../../context/ProductosProvider";
import { useForm } from "react-hook-form";
import client from "../../api/axios";

export const ModalActualizarProveedor = ({ idObtenida }) => {
  const { setProveedores } = useProductosContext();

  const { handleSubmit, register, setValue } = useForm();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/proveedor/${idObtenida}`);
      setValue("proveedor", respuesta.data.proveedor);
      setValue("localidad", respuesta.data.localidad);
      setValue("provincia", respuesta.data.provincia);
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

      toast.success("¡Proveedor actualizado correctamente!", {
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
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };

  return (
    <dialog id="my_modal_editar_proveedor" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Actualiza el proveedor obtenido.</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 flex flex-col gap-2"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-700 uppercase">
              Proveedor
            </label>
            <input
              {...register("proveedor")}
              type="text"
              className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-blue-500 border rounded outline-none"
              placeholder="DETALLE DEL PROVEEDOR"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-700 uppercase">
              Localidad
            </label>
            <input
              {...register("localidad")}
              type="text"
              className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-blue-500 border rounded outline-none"
              placeholder="LOCALIDAD DEL PROVEEDOR"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-700 uppercase">
              Provincia
            </label>
            <input
              {...register("provincia")}
              type="text"
              className="py-2 px-4 uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-white border-blue-500 border rounded outline-none"
              placeholder="PROVINCIA DEL PROVEEDOR"
            />
          </div>
          <div>
            <button
              type="submit"
              class="group relative hover:bg-orange-500 text-white transition-all ease-in-out bg-blue-500 font-bold text-sm py-2 px-4 rounded-full flex items-center justify-center"
            >
              Actualizar el proveedor
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
