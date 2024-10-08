import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { ModalComprobante } from "../../../components/Modales/ModalComprobante";
import { ModalObtenerCompra } from "../../../components/Modales/ModalObtenerCompra";
import { ModalEditarSaldoProveedor } from "../../../components/Modales/ModalEditarSaldoProveedor";
import { useAuth } from "../../../context/AuthProvider";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCashRegister,
  FaFile,
} from "react-icons/fa";
import client from "../../../api/axios";
import { CgMenuRightAlt } from "react-icons/cg";
import axios from "axios";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import { useProductosContext } from "../../../context/ProductosProvider";
import { useObtenerId } from "../../../helpers/obtenerId";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { ButtonLink } from "../../../components/ui/ButtonLink";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImprimirPdfResumen } from "../../../components/pdf/ImprimirPdfResumen";

export const Proveedor = () => {
  const { user } = useAuth();
  const [datos, setDatos] = useState([]);

  const [comprobantes, setComprobantes] = useState([]);

  const [filtroTipoPago, setFiltroTipoPago] = useState("");

  const [isOpenComprobante, setOpenComprobante] = useState(false);
  const [isOpenComprobanteEliminar, setOpenComprobanteEliminar] =
    useState(false);

  const openComprobante = () => {
    setOpenComprobante(true);
  };

  const closeComprobante = () => {
    setOpenComprobante(false);
  };

  const openComprobanteEliminar = () => {
    setOpenComprobanteEliminar(true);
  };

  const closeComprobanteEliminar = () => {
    setOpenComprobanteEliminar(false);
  };

  const [isOpen, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/proveedor/${params.id}`);

      setDatos(res.data);
    }

    loadData();
  }, [params.id]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/comprobantes/${params.id}`);

      setComprobantes(res.data);

      console.log("asdasd", res.data);
    }

    loadData();
  }, [params.id]);

  console.log("asdsad", params.id);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [fechaInicial, setFechaInicial] = useState(fechaInicioPorDefecto);
  const [fechaFinal, setFechaFinal] = useState(fechaFinPorDefecto);

  const orderByCreatedAtDescending = (a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  };

  const sortedComprobantes = comprobantes.sort(orderByCreatedAtDescending);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = sortedComprobantes.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(sortedComprobantes.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages);
    const startPage = Math.max(1, maxPages - 4);
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const filtrarPorFechaYTipoPago = (producto) => {
    const fechaProducto = new Date(producto.created_at).getTime();
    const fechaInicialTimestamp = new Date(fechaInicial).getTime();
    const fechaFinalTimestamp = new Date(fechaFinal).getTime();

    const cumpleFecha =
      (!fechaInicial || fechaProducto >= fechaInicialTimestamp) &&
      (!fechaFinal || fechaProducto <= fechaFinalTimestamp);

    const cumpleTipoPago = !filtroTipoPago || producto.tipo === filtroTipoPago;

    return cumpleFecha && cumpleTipoPago;
  };

  const productosFiltrados = sortedComprobantes.filter(
    filtrarPorFechaYTipoPago
  );

  const resetFechas = () => {
    setFechaFinal("");
    setFechaInicial("");
  };

  // Obtener el mes y año actuales
  const hoy = new Date();
  const mesActual = hoy.getMonth(); // El mes actual (0 = enero, 11 = diciembre)
  const añoActual = hoy.getFullYear(); // El año actual

  // Filtrar los comprobantes del mes actual
  const comprobantesDelMes = comprobantes.filter((comprobante) => {
    const fechaComprobante = new Date(comprobante.created_at); // Convertir la fecha del comprobante a un objeto Date
    const mesComprobante = fechaComprobante.getMonth(); // Obtener el mes del comprobante
    const añoComprobante = fechaComprobante.getFullYear(); // Obtener el año del comprobante

    return mesComprobante === mesActual && añoComprobante === añoActual; // Filtrar por comprobantes del mes actual y del mismo año
  });

  // Calcular el total de los comprobantes del mes
  const totalEnComprobantes = comprobantesDelMes.reduce((acc, comprobante) => {
    return acc + parseFloat(comprobante.total);
  }, 0);

  const totalEnComprobantesFiltrados = productosFiltrados.reduce(
    (acc, comprobante) => {
      return acc + parseFloat(comprobante.total);
    },
    0
  );

  const [isComprobante, setIsComprobante] = useState(false);
  const [obtenerId, setObtenerId] = useState("");

  const openComprobanteModal = () => {
    setIsComprobante(true);
  };

  const closeComprobanteModal = () => {
    setIsComprobante(false);
  };

  const handleID = (id) => setObtenerId(id);

  const { handleObtenerId, idObtenida } = useObtenerId();

  const paymentTypes = [
    "Tarjeta de Crédito",
    "Tarjeta de Débito",
    "Transferencia Bancaria",
    "Efectivo",
    "Pago Móvil",
    "Criptomoneda",
    "PayPal",
    "Débito Directo",
    "Cheque",
    "Cheque electronico",
    "Cheque propio",
    "Cheque de terceros",
    "Depositos",
  ];

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <ButtonLink link={"/proveedores"} />
      <div className="bg-gray-100 py-10 px-10 mb-10 flex justify-between items-center max-md:flex-col max-md:gap-3 max-md:mb-0">
        <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Sector del proveedor.{" "}
          {/* <FaArrowRight className="text-gray-700 text-2xl" /> */}
        </p>
        <p className="font-medium text-xl text-white">
          <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent capitalize">
            Proveedor {datos.proveedor}.
          </span>
        </p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-2 max-md:grid-cols-1 max-md:pt-5">
        <div className="bg-gray-800 py-5 px-5 rounded-md flex flex-col justify-center items-center shadow-md gap-2">
          <p className="text-white font-medium text-xl">
            Total deuda del proveedor.
          </p>
          <p className="font-extrabold text-3xl bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent">
            {formatearDinero(Number(datos?.total))}
          </p>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-md flex flex-col justify-center items-center shadow-md gap-2">
          <p className="text-white font-medium text-xl">
            Total en pagado a proveedor.
          </p>
          <p className="font-extrabold text-2xl bg-gradient-to-r from-blue-400 to-green-300 bg-clip-text text-transparent">
            {formatearDinero(Number(totalEnComprobantesFiltrados))}
          </p>
        </div>
        <div className="bg-gray-800 py-5 px-5 rounded-md flex flex-col justify-center items-center shadow-md gap-2">
          <p className="text-white font-medium text-xl">
            Total comprobantes cargados.
          </p>
          <p className="font-extrabold text-2xl bg-gradient-to-r from-yellow-400 to-pink-300 bg-clip-text text-transparent">
            {productosFiltrados.length}
          </p>
        </div>
      </div>

      {user.tipo === "admin" ? (
        ""
      ) : (
        <div className="mx-5 py-2 flex max-md:flex-col gap-2 items-center max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2  max-md:bg-white max-md:px-5 max-md:py-5 mt-10 max-md:mt-0">
          <button
            onClick={() =>
              document
                .getElementById("my_modal_cargar_comprobante_de_pago")
                .showModal()
            }
            className="bg-gradient-to-r from-primary to-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm max-md flex gap-2 items-center"
          >
            Cargar nuevo comprobante de pago{" "}
            <FaMoneyBillWaveAlt className="text-xl" />
          </button>
          <button
            onClick={() =>
              document.getElementById("my_modal_filtrar_pagos").showModal()
            }
            className="bg-gradient-to-r from-green-500 to-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm max-md flex gap-2 items-center"
          >
            Filtrar pagos por categoria{" "}
          </button>
        </div>
      )}

      <div className="mx-5 mt-6 bg-gray-800 py-5 px-5 rounded-md">
        <p className="text-white font-bold">
          Tabla de comprobantes cargados del mes
        </p>
      </div>

      <div className="flex gap-4 mb-1 mt-6 mx-9 max-md:mx-0 items-center max-md:bg-white max-md:px-5 max-md:py-5 max-md:flex-col">
        <div className="flex gap-2 border-r pr-4 border-gray-300 max-md:border-none max-md:pr-0 max-md:w-full">
          <input
            type="date"
            value={fechaInicial}
            onChange={(e) => setFechaInicial(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm uppercase font-semibold outline-none max-md:w-full"
          />

          <input
            type="date"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm uppercase font-semibold outline-none max-md:w-full"
          />
        </div>
        <div className="border-r pr-4 border-gray-300 max-md:border-none max-md:pr-0 max-md:w-full">
          <select
            value={filtroTipoPago}
            onChange={(e) => setFiltroTipoPago(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-sm uppercase font-semibold outline-none max-md:w-full"
          >
            <option value="">Todos</option>
            {paymentTypes.map((tipo) => (
              <option className="font-semibold text-xs" key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="max-md:w-full">
          <button
            onClick={() => {
              document.getElementById("my_modal_resumen_pagos").showModal();
            }}
            type="button"
            className="font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md text-sm flex gap-2 items-center max-md:w-full justify-between"
          >
            Descargar resumen de pagos <FaCashRegister className="text-xl" />
          </button>
        </div>
      </div>

      <div className="max-md:overflow-x-auto mx-5 my-5 max-md:h-[100vh] scrollbar-hidden">
        <table className="table">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th>Numero °</th>
              <th>Tipo de pago</th>
              <th>Total del comprobante</th>
              <th>Total del comprobante final</th>
              <th>Ver comprobante</th>
              <th>Fecha de creación</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody className="text-xs uppercase font-medium">
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <th>{p.id}</th>
                <th>{p.tipo}</th>
                <td>
                  {Number(p.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td>
                  {" "}
                  <span className="text-white bg-gradient-to-r from-green-500 to-blue-500 font-bold py-1.5 px-5 rounded">
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </td>
                <td>
                  <ImagenModal archivo={p.imagen} />
                </td>
                <td>
                  {p?.created_at?.split("T")[0]} / <strong>HORA:</strong>{" "}
                  {p?.created_at?.split("T")[1]}
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-xs cursor-pointer space-x-2">
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
                      <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white capitalize">
                        <button
                          onClick={() => {
                            handleObtenerId(p.id),
                              document
                                .getElementById("my_modal_eliminar")
                                .showModal();
                          }}
                          type="button"
                        >
                          Eliminar comprob.
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalCargarComprobanteDePago
        setComprobantes={setComprobantes}
        isOpen={isOpenComprobante}
        closeModal={closeComprobante}
        OBTENERID={params.id}
        datos={datos}
        setDatos={setDatos}
      />
      <ModalComprobante
        setComprobantes={setComprobantes}
        isOpen={isOpenComprobante}
        closeModal={closeComprobante}
        OBTENERID={params.id}
        datos={datos}
        setDatos={setDatos}
      />
      <ModalObtenerCompra
        isOpen={isComprobante}
        closeModal={closeComprobanteModal}
        obtenerId={obtenerId}
      />
      <ModalEditarSaldoProveedor
        setDatos={setDatos}
        datos={datos}
        obtenerId={obtenerId}
        isOpen={isOpen}
        closeModal={closeModal}
        params={params}
      />

      <ModalEliminar
        setComprobantes={setComprobantes}
        idObtenida={idObtenida}
        setDatos={setDatos}
      />
      <ModalResumenPagos
        datos={productosFiltrados}
        fechFin={fechaFinal}
        fechaIncio={fechaInicial}
        proveedor={datos}
        total={totalEnComprobantesFiltrados}
      />
    </section>
  );
};

const ImagenModal = ({ archivo }) => {
  const [showModal, setShowModal] = useState(false);

  // Función para determinar si el archivo es una imagen
  const esImagen = (archivo) => {
    const extensionesImagenes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const extension = archivo?.split(".").pop().toLowerCase();
    return extensionesImagenes.includes(extension);
  };

  return (
    <>
      <td
        className="bg-gradient-to-r from-primary to-blue-500 text-white py-1.5 px-5 rounded font-bold text-xs cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        Ver comprobante
      </td>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 w-full flex justify-center relative">
            <button
              className="absolute top-0 right-0 m-4 text-gray-700  py-2 px-2 rounded-full hover:bg-gray-200 transition-all ease-linear"
              onClick={() => setShowModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {esImagen(archivo) ? (
              <img src={archivo} alt="Imagen" className="w-[600px] h-[600px]" />
            ) : (
              <iframe src={archivo} className="h-[600px] w-[1200px]" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const ModalResumenPagos = ({
  datos,
  fechaIncio,
  fechFin,
  proveedor,
  total,
}) => {
  return (
    <dialog id="my_modal_resumen_pagos" className="modal">
      <div className="modal-box rounded-md max-w-6xl max-md:h-full max-md:max-h-full max-md:w-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="py-8">
          <div className="flex justify-between w-full max-md:flex-col">
            <p className="font-bold text-lg">Descargar el resumen.</p>{" "}
            <p className="font-bold text-blue-500">
              <span className="text-gray-800">Desde</span> {fechaIncio}{" "}
              <span className="text-gray-800">Hasta</span> {fechFin}.
            </p>
          </div>
          <PDFViewer className="h-[50vh] w-full mt-5 max-md:hidden">
            <ImprimirPdfResumen
              proveedor={proveedor}
              datos={datos}
              fechaFin={fechFin}
              fechaInicio={fechaIncio}
              total={total}
            />
          </PDFViewer>
          <div className="mt-5">
            <PDFDownloadLink
              fileName={`Resumen desde ${fechaIncio} hasta ${fechFin}`}
              document={
                <ImprimirPdfResumen
                  proveedor={proveedor}
                  datos={datos}
                  fechaFin={fechFin}
                  fechaInicio={fechaIncio}
                  total={total}
                />
              }
              className="bg-gradient-to-r from-primary to-blue-500 text-white px-2 py-1 rounded-md md:hidden flex gap-2  items-center justify-between font-semibold"
            >
              Descargar documento <FaFile className="text-xl" />
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export const ModalCargarComprobanteDePago = ({
  datos,
  setComprobantes,
  setDatos,
}) => {
  const [params, setParams] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [total, setTotal] = useState(0);
  const [tipo, setTipo] = useState("");
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
      tipo,
      imagen: imgUrl,
    };

    try {
      const res = await client.post(`/crear-comprobante`, data);

      setComprobantes(res.data.comprobantes);
      setProveedores(res.data.proveedores);

      setDatos(res.data.proveedorActualizado);

      document.getElementById("my_modal_cargar_comprobante_de_pago").close();

      showSuccessToast("Comprobante cargado..");

      setTipo("");
      setTotal(0);
    } catch (error) {
      console.error("Error al agregar el comprobante:", error);
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

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  const paymentTypes = [
    "Tarjeta de Crédito",
    "Tarjeta de Débito",
    "Transferencia Bancaria",
    "Efectivo",
    "Pago Móvil",
    "Criptomoneda",
    "PayPal",
    "Débito Directo",
    "Cheque",
    "Cheque electronico",
    "Cheque propio",
    "Cheque de terceros",
    "Depositos",
  ];

  return (
    <dialog id="my_modal_cargar_comprobante_de_pago" className="modal">
      <div className="modal-box rounded-md max-w-xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form
          encType="multipart/form-data"
          onSubmit={onSubmit}
          className="py-5 flex flex-col items-start"
        >
          <div onClick={handleInputClick} className="cursor-pointer">
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total del pago</label>
                <input
                  onChange={(e) => setTotal(e.target.value)}
                  value={total}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Total del pago</label>

                <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                  {formatearDinero(Number(total) || 0)}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="font-bold text-sm">
              Tipo de pago de la orden
            </label>
            <select
              onChange={(e) => setTipo(e.target.value)}
              value={tipo}
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
            >
              <option className="font-bold text-primary">
                Seleccione un tipo de pago
              </option>
              {paymentTypes.map((tipo) => (
                <option
                  className="font-semibold text-xs"
                  key={tipo}
                  value={tipo}
                >
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-gray-300 rounded-md py-2 px-3 mt-4 flex flex-col gap-2">
            <label
              className=" text-slate-700 text-sm font-bold"
              htmlFor="fileUpload"
            >
              Comprobante
            </label>
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              id="fileUpload"
              onChange={handleFileChange}
              className="w-full file-input file-input-bordered outline-none"
            />
          </div>

          {previewUrl && (
            <div className="mt-2 flex flex-col gap-3 w-full">
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
                    className="h-[600px] w-full rounded-2xl shadow max-w-full"
                  />
                )}
              </div>
            </div>
          )}

          <div className="mt-3">
            <button
              className="py-1.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-md text-white transition-all rounded-md font-semibold text-sm flex gap-2 items-center"
              type="submit"
            >
              Cargar el pago <FaMoneyBillWaveAlt className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida, setDatos, setComprobantes }) => {
  const { setProveedores } = useProductosContext();

  const handleEliminarOrden = async (id) => {
    try {
      const res = await client.delete(`/comprobante/${id}`);

      setDatos(res.data.updatedProveedor);
      setComprobantes(res.data.comprobantes);
      setProveedores(res.data.proveedores);

      console.log(res.data);
      showSuccessToastError("Comprobante eliminado");

      document.getElementById("my_modal_eliminar").close();
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
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
        <form>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-lg text-center bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Eliminar el producto seleccionado..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El producto no podra ser recuperado nunca mas...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              onClick={() => handleEliminarOrden(idObtenida)}
              type="button"
              className="bg-gradient-to-r from-red-600 to-yellow-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar").close()
              }
              className="bg-gradient-to-r from-green-500 to-blue-500 py-1 px-4 text-center font-bold text-white mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
