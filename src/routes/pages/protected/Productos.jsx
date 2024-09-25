import { useEffect, useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { FaSearch } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { formatearDinero } from "../../../helpers/formatearDinero";
import client from "../../../api/axios";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import { useForm } from "react-hook-form";
import { CgMenuRightAlt } from "react-icons/cg";
import { useObtenerId } from "../../../helpers/obtenerId";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ListaDePrecios } from "../../../components/pdf/ListaDePrecios";

export const Productos = () => {
  const { productos, categorias } = useProductosContext();

  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Sector de productos.</p>
        <button
          onClick={() =>
            document.getElementById("my_modal_crear_producto").showModal()
          }
          type="button"
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Crear nuevo producto
        </button>
      </div>

      <div className="px-5 pt-10 flex gap-2">
        {" "}
        <button
          onClick={() =>
            document.getElementById("my_modal_categorias").showModal()
          }
          type="button"
          className="bg-primary py-2 px-4 rounded-md text-white font-semibold text-sm"
        >
          Ver categorias
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_ver_productos").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm"
        >
          Ver lista de precios de productos $
        </button>
        {/* <PDFDownloadLink
          fileName="Lista de precios-sector-compras."
          document={<ListaDePrecios datos={productos} />}
          className="bg-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm"
        >
          Ver lista de precios
        </PDFDownloadLink> */}
      </div>

      <div className="mt-5 mx-5 flex gap-2 max-md:flex-col">
        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar por nombre del producto.."
          />
          <FaSearch className="text-gray-700" />
        </div>

        <div>
          <select
            className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="font-bold text-blue-500 text-xs" value="all">
              Todas las categorías
            </option>
            {categorias.map((c) => (
              <option className="font-semibold uppercase text-xs" key={c.id}>
                {c?.detalle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="max-md:overflow-x-auto mx-5 my-10 max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr className="">
                <th>Codigo</th>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio Und</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody className="text-xs capitalize font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="uppercase">{p.detalle}</td>
                  <td className="uppercase">{p.categoria}</td>
                  <td className="">
                    <div className="flex">
                      <p className="bg-gray-800 py-1.5 px-2 rounded-md text-white font-bold">
                        {Number(p.precio_und).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="max-md:block hidden">
                    <div className="flex gap-3 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          handleObtenerId(p.id),
                            document
                              .getElementById("my_modal_actualizar_producto")
                              .showModal();
                        }}
                        className="bg-blue-500 py-1 px-2 rounded-md text-xs font-semibold text-white"
                      >
                        Actualizar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleObtenerId(p.id),
                            document
                              .getElementById("my_modal_eliminar")
                              .showModal();
                        }}
                        className="bg-red-500 py-1 px-2 rounded-md text-xs font-semibold text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                  <td className="max-md:hidden">
                    <div className="dropdown dropdown-left z-1">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-gray-800 hover:text-white rounded-full px-1 py-1 transition-all"
                      >
                        <CgMenuRightAlt className="text-2xl" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-1 border border-gray-300 rounded-md bg-white shadow-xl w-52 gap-1"
                      >
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleObtenerId(p.id),
                                document
                                  .getElementById(
                                    "my_modal_actualizar_producto"
                                  )
                                  .showModal();
                            }}
                          >
                            Actualizar producto
                          </span>
                        </li>
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleObtenerId(p.id),
                                document
                                  .getElementById("my_modal_eliminar")
                                  .showModal();
                            }}
                          >
                            Eliminar producto
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalCategorias />
      <ModalCrearProducto />
      <ModalActualizarProducto idObtenida={idObtenida} />
      <ModalEliminar idObtenida={idObtenida} />
      <ModalVerProductos productos={productos} />
    </section>
  );
};

export const ModalCrearProducto = () => {
  const [precio_und, setPrecio] = useState(0);
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

      setPrecio(0);
      setDetale("");
      setProveedor("");
      setCategoria("");

      document.getElementById("my_modal_crear_producto").close();

      showSuccessToast("Producto creado correctamente");
    } catch (error) {
      console.error("Error al enviar el producto:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_producto" className="modal">
      <div className="modal-box rounded-md max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar producto nuevo.</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar nuevos productos, para las ordenes de
          compra, lista de precios, etc.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Detalle del producto</label>
            <input
              onChange={(e) => setDetale(e.target.value)}
              value={detalle}
              type="text"
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
              placeholder="Escribe el nombre del producto.."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Seleccionar categoria</label>
            <div className="flex gap-2 items-center">
              <select
                type="text"
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium capitalize outline-none focus:shadow-md"
                onChange={(e) => setCategoria(e.target.value)}
                value={categoria}
              >
                <option className="font-bold text-primary" value="">
                  Seleccionar la categoria
                </option>
                {categorias.map((c) => (
                  <option
                    className="font-semibold uppercase text-xs"
                    key={c.id}
                  >
                    {c.detalle}
                  </option>
                ))}
              </select>
              <div
                onClick={() =>
                  document
                    .getElementById("my_modal_crear_categoria")
                    .showModal()
                }
                className="cursor-pointer"
              >
                <IoMdAdd className="text-2xl border border-gray-300 rounded-md py-0.5 px-0.5" />
              </div>
            </div>
          </div>

          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>
                <input
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio_und}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>

                <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                  {formatearDinero(Number(precio_und) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Crear nuevo producto
            </button>
          </div>
        </form>

        <ModalCrearCategoria />
      </div>
    </dialog>
  );
};

export const ModalActualizarProducto = ({ idObtenida }) => {
  const { setProductos, categorias } = useProductosContext();

  const [precio_und, setPrecio] = useState(0);
  const [detalle, setDetale] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/producto/${idObtenida}`);

      setDetale(res.data.detalle);
      setCategoria(res.data.categoria);
      setPrecio(res.data.precio_und);
    }
    loadData();
  }, [idObtenida]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosProducto = { precio_und, detalle, categoria };

    const res = await client.put(
      `/editar-producto/${idObtenida}`,
      datosProducto
    );

    setProductos(res.data);

    document.getElementById("my_modal_actualizar_producto").close();

    showSuccessToast("Producto actualizado");
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_actualizar_producto" className="modal">
      <div className="modal-box rounded-md max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Detalle del producto</label>
            <input
              onChange={(e) => setDetale(e.target.value)}
              value={detalle}
              type="text"
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
              placeholder="Escribe el nombre del producto.."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Seleccionar categoria</label>
            <div className="flex gap-2 items-center">
              <select
                type="text"
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium capitalize outline-none focus:shadow-md"
                onChange={(e) => setCategoria(e.target.value)}
                value={categoria}
              >
                <option className="font-bold text-primary" value="">
                  Seleccionar la categoria
                </option>
                {categorias.map((c) => (
                  <option
                    className="font-semibold uppercase text-xs"
                    key={c.id}
                  >
                    {c.detalle}
                  </option>
                ))}
              </select>
              <div
                onClick={() =>
                  document
                    .getElementById("my_modal_crear_categoria")
                    .showModal()
                }
                className="cursor-pointer"
              >
                <IoMdAdd className="text-2xl border border-gray-300 rounded-md py-0.5 px-0.5" />
              </div>
            </div>
          </div>

          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>
                <input
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio_und}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>

                <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                  {formatearDinero(Number(precio_und) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar el producto
            </button>
          </div>
        </form>

        <ModalCrearCategoria />
      </div>
    </dialog>
  );
};

export const ModalCrearCategoria = () => {
  const { register, handleSubmit } = useForm();

  const { setCategorias } = useProductosContext();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-categoria", data);

    setCategorias(res.data);

    showSuccessToast("Creado correctamente");

    document.getElementById("my_modal_crear_categoria").close();
  });

  return (
    <dialog id="my_modal_crear_categoria" className="modal">
      <div className="modal-box rounded-md max-w-sm">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Nombre de la categoria</label>
            <input
              {...register("detalle")}
              type="text"
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium capitalize outline-none focus:shadow-md"
              placeholder="Escribe de la categoria.."
            />
          </div>
          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-blue-500 hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Guardar la categoria
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export const ModalCategorias = () => {
  const { categorias, setCategorias } = useProductosContext();

  const HandleEliminarCategoria = async (id) => {
    const res = await client.delete(`/eliminar-categoria/${id}`);

    setCategorias(res.data);

    showSuccessToastError("Categoria eliminada");
  };

  return (
    <dialog id="my_modal_categorias" className="modal">
      <div className="modal-box rounded-md max-w-3xl max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl">
          Categorias cargadas en el sistema.
        </h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar una nueva categoria, eliminarla, etc.
        </p>

        <div className="mt-2 max-md:mt-5">
          <button
            onClick={() =>
              document.getElementById("my_modal_crear_categoria").showModal()
            }
            type="button"
            className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
          >
            Crear nueva categoria
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-3 max-md:grid-cols-2">
          {categorias.map((c) => (
            <div className="flex gap-2 py-1 px-2 border border-gray-300 rounded-md text-sm font-bold uppercase justify-between items-center">
              {c.detalle}{" "}
              <FaDeleteLeft
                className="text-red-600 text-xl cursor-pointer"
                onClick={() => HandleEliminarCategoria(c.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setProductos } = useProductosContext();

  const onSubmit = async (formData) => {
    try {
      const productosData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/producto/${idObtenida}`, productosData);

      setProductos(res.data);

      document.getElementById("my_modal_eliminar").close();

      showSuccessToastError("Eliminado correctamente");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_eliminar" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-[#FD454D] text-lg text-center">
            Eliminar el producto seleccionado..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El producto no podra ser recuperado nunca mas...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              type="submit"
              className="bg-red-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar").close()
              }
              className="bg-orange-100 py-1 px-4 text-center font-bold text-orange-600 mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalVerProductos = ({ productos }) => {
  return (
    <dialog id="my_modal_ver_productos" className="modal">
      <div className="modal-box rounded-md max-w-full h-full py-10 px-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <PDFViewer className="w-full h-full max-md:hidden">
          {<ListaDePrecios datos={productos} />}
        </PDFViewer>
      </div>
    </dialog>
  );
};
