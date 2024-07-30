import { useEffect, useState } from "react";
import { useProductosContext } from "../../../context/ProductosProvider";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfProveedores } from "../../../components/pdf/PdfProveedores";
import { ModalFiltrarComprobantes } from "../../../components/Modales/ModalFiltrarComprobantes";
import { FaSearch } from "react-icons/fa";
import { CgMenuRightAlt, CgSearch } from "react-icons/cg";
import { ModalActualizarProveedor } from "../../../components/Modales/ModalActualizarProveedor";
import { useObtenerId } from "../../../helpers/obtenerId";
import { ModalEliminarProveedor } from "../../../components/Modales/ModalEliminarProveedor";
import client from "../../../api/axios";
import { useForm } from "react-hook-form";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { showSuccessToastError } from "../../../helpers/toast";

export const Proveedores = () => {
  const { proveedores } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  const { handleObtenerId, idObtenida } = useObtenerId();

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes-mes");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

  const totalAcumulado = comprobantesMensuales.reduce((acumulado, item) => {
    const totalNum = parseFloat(item.total); // Convertir a número
    return acumulado + totalNum;
  }, 0); // Inicia la acumulación desde cero

  console.log(totalAcumulado);

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

  const [isOpen, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  // Ordenar por el total de mayor a menor
  const sortedProveedores = [...proveedores].sort((a, b) => b.total - a.total);

  // Filtrar productos por el término de búsqueda antes de la paginación
  const filteredProveedores = sortedProveedores.filter((product) =>
    product.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProveedores.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProveedores.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const precioTotal = sortedProveedores.reduce(
    (total, orden) => total + Number(orden.total),
    0
  );

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">
          Sector de proveedores.
        </p>
        <button
          onClick={() =>
            document.getElementById("my_modal_crear_proveedor").showModal()
          }
          type="button"
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Crear nuevo proveedor
        </button>
      </div>

      <div className="bg-white py-5 px-5 my-5">
        <div className="dropdown dropdown-bottom dropdown-hover">
          <button className="font-bold text-sm bg-blue-500 py-2 px-4 text-white rounded">
            Ver estadisticas de los proveedores
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-0.5 bg-gray-800 rounded-md w-[800px] border max-md:w-80"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-1 bg-white py-3 px-3 rounded-md">
                <p className="font-medium text-sm">
                  Total en proveedores/deuda
                </p>
                <p className="font-bold text-lg text-red-500">
                  {precioTotal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1 bg-white py-3 px-3 rounded-md">
                <p className="font-medium text-sm">Total en comprobantes</p>
                <p className="font-bold text-lg text-blue-500">
                  {totalAcumulado.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>{" "}
              <div className="flex flex-col gap-1 bg-white py-3 px-3 rounded-md">
                <p className="font-medium text-sm">Total de proveedores</p>
                <p className="font-bold text-lg text-blue-500">
                  {proveedores.length}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="mx-5 flex gap-2 items-center max-md:flex-col max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-5 max-md:bg-white max-md:px-4 max-md:py-5 max-md:h-[10vh] max-md:overflow-y-auto">
        <PDFDownloadLink
          className="text-white bg-green-500 py-1.5 px-6 rounded font-bold max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
          document={<PdfProveedores datos={proveedores} />}
        >
          Descargar lista de proveedores
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

        <button
          className="text-white bg-primary py-2 px-6 rounded font-bold max-md:text-xs flex gap-2 items-center transition-all ease-linear text-sm"
          onClick={() =>
            document.getElementById("my_modal_proveedores").showModal()
          }
        >
          Descargar lista proveedores comprobantes
        </button>
      </div>

      <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-auto mx-5  my-5">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="outline-none font-medium w-full"
          placeholder="Buscar por el proveedor.."
        />
        <FaSearch className="text-gray-700" />
      </div>

      <div className="max-md:overflow-x-auto mx-5 my-5 max-md:h-[100vh] scrollbar-hidden">
        <table className="table">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th>Proveedor</th>
              <th>Total Deber</th>
              <th>Total final deber</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody className="text-xs capitalize font-medium">
            {filteredProveedores.map((p) => (
              <tr className="hover:bg-gray-100/40 transition-all" key={p.id}>
                <td>{p.proveedor}</td>
                <td>
                  {Number(p.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td>
                  {" "}
                  <span
                    className={`${
                      p.total > 0
                        ? "bg-red-100/90 text-red-700"
                        : "bg-green-100/90 text-green-700"
                    } py-1 px-3 rounded font-bold`}
                  >
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </td>
                <th className="max-md:hidden">
                  <div className="flex">
                    <p
                      className={`${
                        p.total > 0
                          ? "bg-orange-100/90 text-orange-700"
                          : "bg-green-100/90 text-green-700"
                      } py-1.5 px-3 rounded`}
                    >
                      {p.total > 0
                        ? "Deudas con el proveedor, pagar ahora"
                        : "Sin deudas con el proveedor.."}
                    </p>
                  </div>
                </th>
                <th className="md:hidden">
                  <div className="flex">
                    <p
                      className={`${
                        p.total > 0
                          ? "bg-orange-100 text-orange-500"
                          : "bg-green-100 text-green-500"
                      } py-1 px-3 rounded`}
                    >
                      {p.total > 0 ? "Debe" : "Limpio"}
                    </p>
                  </div>
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs cursor-pointer space-x-2 flex">
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
                      {" "}
                      <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                        <Link
                          className="capitalize"
                          to={`/proveedores/${p.id}`}
                        >
                          Cargar nuevos pagos{" "}
                        </Link>{" "}
                      </li>
                      <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                        <button
                          onClick={() => {
                            handleObtenerId(p.id),
                              document
                                .getElementById("my_modal_editar_proveedor")
                                .showModal();
                          }}
                          type="button"
                        >
                          Editar proveedor{" "}
                        </button>{" "}
                      </li>
                      <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                        <button
                          onClick={() => {
                            handleObtenerId(p.id),
                              document
                                .getElementById("my_modal_eliminar")
                                .showModal();
                          }}
                          type="button"
                        >
                          Eliminar proveedor{" "}
                        </button>
                      </li>
                    </ul>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCrearProveedor />

      <ModalFiltrarComprobantes />
      <ModalActualizarProveedor idObtenida={idObtenida} />
      <ModalEliminar idObtenida={idObtenida} />
    </section>
  );
};

export const ModalCrearProveedor = () => {
  const { setProveedores } = useProductosContext();

  const { register, handleSubmit, watch, reset } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-proveedor", data);

    setProveedores(res.data);

    document.getElementById("my_modal_crear_proveedor").close();
    reset();
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const total = watch("total");

  return (
    <dialog id="my_modal_crear_proveedor" className="modal">
      <div className="modal-box rounded-md max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo proveedor</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar nuevos proveedores.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-3">
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

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Cargar el proveedor
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setProveedores } = useProductosContext();

  const onSubmit = async (formData) => {
    try {
      const productosData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(
        `/eliminar-proveedor/${idObtenida}`,
        productosData
      );

      setProveedores(res.data);

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
            Eliminar el proveedor seleccionado..
          </div>
          <div className="tex´t-sm text-gray-400 text-center mt-1">
            El proveedor no podra ser recuperado nunca mas...
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
