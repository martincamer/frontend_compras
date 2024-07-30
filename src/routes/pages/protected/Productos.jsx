import { useState } from "react";
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

export const Productos = () => {
  const { productos, categorias } = useProductosContext();

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isOpenCategorias, setIsOpenCategorias] = useState(false);

  const openModalCategorias = () => {
    setIsOpenCategorias(true);
  };

  const closeModalCategorias = () => {
    setIsOpenCategorias(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  // Obtener índices de paginación para productos filtrados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const [editarProducto, setEditarProducto] = useState(false);

  const [OBTENERID, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  const openEditProducto = () => {
    setEditarProducto(true);
  };

  const closeEditProducto = () => {
    setEditarProducto(false);
  };

  const [isOpenEliminar, setIsEliminar] = useState(false);

  const openEliminar = () => {
    setIsEliminar(true);
  };

  const closeEliminar = () => {
    setIsEliminar(false);
  };

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
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Ver categorias
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_precios").showModal()
          }
          type="button"
          className="bg-blue-500 py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Ver lista de precios
        </button>
      </div>
      {/* <div className="mx-5 py-1 flex gap-2 items-center max-md:px-0 max-md:py-0 max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-5">
        <button
          onClick={() => openModal()}
          className="bg-primary py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-blue-500/90"
        >
          Crear nuevo producto
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button
          className="bg-orange-500 py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-orange-500/80"
          onClick={() => openModalCategorias()}
        >
          Crear nuevas categorias/editar/etc
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
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
        <PDFDownloadLink
          className="bg-green-500 py-1.5 px-6 rounded text-sm text-white font-medium max-md:text-xs flex gap-2 items-center hover:shadow-md transition-all hover:bg-green-500/80"
          document={<ListaDePrecios datos={productos} />}
        >
          Descargar lista de precios
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </PDFDownloadLink>
      </div> */}
      <div className="mt-5 mx-5 flex gap-2">
        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar por nombre.."
          />
          <FaSearch className="text-gray-700" />
        </div>

        <div>
          <select
            className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option className="font-bold text-blue-500" value="all">
              Todas las categorías
            </option>
            {categorias.map((c) => (
              <option className="font-semibold" key={c.id}>
                {c?.detalle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="max-md:overflow-x-auto mx-5 mt-10">
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
                  <td>{p.detalle}</td>
                  <td>{p.categoria}</td>
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
                  <td className="">
                    <div className="dropdown dropdown-left z-1">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-gray-800 hover:text-white rounded-full px-2 py-2 transition-all"
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
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                          />
                        </svg>
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-1 border border-gray-300 rounded-md bg-white shadow-xl w-52 gap-1"
                      >
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleID(p.id), openEditProducto();
                            }}
                          >
                            Editar producto
                          </span>
                        </li>
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleID(p.id), openEliminar();
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
    </section>
  );
};

export const ModalCrearProducto = () => {
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
      <div className="modal-box rounded-md">
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
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium uppercase outline-none focus:shadow-md"
              placeholder="Detalle del producto"
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
                  <option className="font-semibold" key={c.id}>
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
                  value={precio_und || 0}
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

export const ModalCrearCategoria = () => {
  const { register, handleSubmit } = useForm();

  const { setCategorias } = useProductosContext();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-categoria", data);

    setCategorias(res.data);

    showSuccessToast("Creado correctamente");

    document.getElementById("my_modal_crear_categoria").close();
    document.getElementById("my_modal_crear_producto").close();
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
      <div className="modal-box rounded-md max-w-3xl">
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

        <div className="mt-2">
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

        <div className="grid grid-cols-4 gap-3 mt-3">
          {categorias.map((c) => (
            <div className="flex gap-2 py-1 px-2 border border-gray-300 rounded-md text-sm font-bold capitalize justify-between items-center">
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
