import { useForm } from "react-hook-form";
import client from "../../api/axios";
import { useProductosContext } from "../../context/ProductosProvider";
import { toast } from "react-toastify";

export const ModalNuevaCategoria = () => {
  const { register, handleSubmit, reset } = useForm();
  const { setCategorias } = useProductosContext();

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const categoriaData = {
        ...formData,
      };

      const res = await client.post("/crear-categoria", categoriaData);

      setCategorias(res.data);

      toast.success("¡Categoria creado correctamente!", {
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

      document.getElementById("my_modal_categoria").close();
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_categoria" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Crea una nueva categoria</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm text-slate-700 uppercase">
              Nombre de la categoria
            </label>
            <input
              {...register("detalle")}
              type="text"
              className="py-2 px-4 font-semibold uppercase text-sm border border-blue-500 rounded outline-none"
              placeholder="Nombre de la categoria"
            />
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="bg-blue-500 py-2 px-8 font-semibold hover:bg-orange-500 transition-all rounded-full text-white uppercase text-xs"
            >
              Guardar la categoria
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
