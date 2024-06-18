import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { ModalComprobante } from "../../../components/Modales/ModalComprobante";
import { ModalObtenerCompra } from "../../../components/Modales/ModalObtenerCompra";
import { ModalEditarSaldoProveedor } from "../../../components/Modales/ModalEditarSaldoProveedor";
import { useAuth } from "../../../context/AuthProvider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ModalEliminarComprobante } from "../../../components/Modales/ModalEliminarComprobante";
import client from "../../../api/axios";

export const Proveedor = () => {
  const { user } = useAuth();
  const [datos, setDatos] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);

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
      const res = await client.get(
        `/comprobantes${params.id ? `?params=${params.id}` : ""}`
      );

      setComprobantes(res.data);
    }

    loadData();
  }, [params.id]);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

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

  const filtrarPorFecha = (producto) => {
    if (!fechaInicial || !fechaFinal) {
      return true;
    }

    const fechaProducto = new Date(producto.created_at).getTime();
    const fechaInicialTimestamp = new Date(fechaInicial).getTime();
    const fechaFinalTimestamp = new Date(fechaFinal).getTime();

    return (
      fechaProducto >= fechaInicialTimestamp &&
      fechaProducto <= fechaFinalTimestamp
    );
  };

  const productosFiltrados = currentProducts.filter(filtrarPorFecha);

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

  return (
    <section className="max-h-full min-h-screen h-full w-full">
      <ToastContainer />
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/proveedores"}
          className="bg-sky-100 flex h-full px-4 justify-center items-center font-bold text-sky-600"
        >
          Proveedores
        </Link>{" "}
        <Link className="bg-sky-500 flex h-full px-4 justify-center items-center font-bold text-white capitalize">
          Proveedor {datos.proveedor}
        </Link>
      </div>
      <div className="bg-white py-5 px-5 mx-5 mt-10">
        <h3 className="text-xl font-bold text-sky-500">
          Observa el proveedor y carga comprobantes, pone la cuenta al día de
          proveedor{" "}
          <span className="text-slate-600 capitalize">{datos.proveedor}</span>.
        </h3>
      </div>
      {/* <div className="py-5 px-5 rounded-xl grid grid-cols-3 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
          <div className="flex justify-center h-full gap-4 items-center">
            <span className="rounded-full bg-green-100 p-3 text-green-700 max-md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {Number(comprobantes.length)}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total comprobantes cargados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end rounded-xl bg-green-100 py-2 px-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {Number(comprobantes.length / 1).toFixed(2)} %{" "}
            </span>
          </div>
        </article>

        <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
          <div className="flex justify-center h-full gap-4 items-center">
            <span className="rounded-full bg-green-100 p-3 text-green-700  max-md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700 uppercase">
                {nombreMesActual}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                MES ACTUAL
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-green-100 py-2 px-4 text-green-600">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>

            <span className="text-xs font-medium uppercase">
              {" "}
              {nombreDiaActual}{" "}
            </span>
          </div>
        </article>

        <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
          <div className="flex justify-center h-full gap-4 items-center">
            <span className="rounded-full bg-red-100 p-3 text-red-700  max-md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-red-700">
                {Number(datos.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total deuda proveedor
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-red-100 p-2 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {Number(datos.total / 100000).toFixed(2)} %
            </span>
          </div>
        </article>

        <article className="flex items-start justify-between gap-4 shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-10 px-6">
          <div className="flex justify-center h-full gap-4 items-center">
            <span className="rounded-full bg-green-100 p-3 text-green-700  max-md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {Number(totalEnComprobantes).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en comprobantes a favor
              </p>
            </div>
          </div>

          <div className="inline-flex gap-2 rounded-xl bg-green-100 p-2 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {Number(totalEnComprobantes / 100000).toFixed(2)} %
            </span>
          </div>
        </article>
      </div> */}

      <div className="bg-white py-5 px-5 mx-5 my-10">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de compras
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm text-sky-500">
                  Total en comprobantes cargados del mes.
                </p>
                <p className="font-bold text-lg">
                  {totalEnComprobantes.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>

              <div className="flex flex-col justify-center gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm">
                  Total de deuda del proveedor.
                </p>
                <p className="font-bold text-lg text-red-500">
                  {Number(datos?.total)?.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1 border border-sky-300 py-3 px-3">
                <p className="font-medium text-sm">
                  Total en comprobantes filtrados.
                </p>
                <p className="font-bold text-lg text-sky-500">
                  {Number(totalEnComprobantesFiltrados)?.toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                    }
                  )}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {user.tipo === "admin" ? (
        ""
      ) : (
        <div className="mx-5 py-2 flex max-md:flex-col gap-2 items-center max-md:px-0 max-md:py-0 max-md:items-start border-b-[1px] border-slate-300 pb-4 max-md:pb-4 max-md:mx-2 max-md:overflow-x-scroll scrollbar-hidden">
          <button
            onClick={() => openComprobante()}
            className="text-sm text-white bg-sky-400 py-3 px-6 rounded font-bold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear"
          >
            Cargar nuevo comprobante de pago
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 max-md:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              handleID(params.id), openModal();
            }}
            className=" text-sm text-white bg-orange-400 py-3 px-6 rounded font-semibold uppercase max-md:text-xs flex gap-2 items-center transition-all ease-linear"
          >
            Editar el saldo del proveedor
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 max-md:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mx-5 mt-6 bg-white py-6 px-4 border-sky-300 border">
        <p className="underline text-sky-400 uppercase font-semibold">
          Tabla de comprobantes cargados del mes
        </p>
      </div>

      <div className="flex gap-4 mb-1 mt-6 mx-9 items-center">
        <input
          type="date"
          value={fechaInicial}
          onChange={(e) => setFechaInicial(e.target.value)}
          className="px-4 py-2 border border-sky-300 text-sm uppercase font-semibold"
        />

        <span className="uppercase font-bold text-sm text-slate-700">
          desde
        </span>
        <input
          type="date"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
          className="px-4 py-2 border border-sky-300 text-sm uppercase font-semibold"
        />

        <div>
          <button
            className="uppercase text-sm bg-red-100 text-red-800 py-2 px-4 rounded font-bold"
            type="button"
            onClick={() => resetFechas()}
          >
            Volver al mes normal/resetear
          </button>
        </div>
      </div>

      <div className="mt-6 mx-8">
        <table className="min-w-full divide-y-2 bg-white text-sm table rounded-none">
          <thead className="text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Numero °
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Total del comprobante
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Total del comprobante final
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Ver comprobante
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Acciones
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-gray-900 uppercase font-bol text-xs">
                Fecha de creación
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <th className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-xs">
                  {p.id}
                </th>
                <th className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-xs">
                  {Number(p.total).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </th>
                <td className="whitespace-nowrap px-4 py-6 text-green-800 uppercase text-xs font-bold">
                  {" "}
                  <span className="bg-green-100 py-2 px-5 rounded">
                    {Number(p.total).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </td>
                <td>
                  <ImagenModal archivo={p.imagen} />
                </td>
                <td className="whitespace-nowrap px-4 py-6 text-gray-700 uppercase text-xs cursor-pointer space-x-2">
                  <div className="dropdown dropdown-left z-1">
                    <div
                      tabIndex={0}
                      role="button"
                      className="hover:bg-gray-200 rounded-full px-2 py-2 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
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
                      className="dropdown-content z-[1] menu p-3 border-sky-300 border bg-white w-52 gap-2"
                    >
                      <Link
                        onClick={() => {
                          handleID(p.id), openComprobanteModal();
                        }}
                        className="hover:text-sky-500 transition-all text-left hover:underline font-semibold capitalize"
                      >
                        Ver comprobante
                      </Link>

                      <Link
                        target="_blank"
                        to={`/pdf-comprobante/${p.id}`}
                        className="hover:text-sky-500 transition-all text-left hover:underline font-semibold capitalize"
                      >
                        Descargar comprob.
                      </Link>

                      <button
                        onClick={() => {
                          handleID(p.id), openComprobanteEliminar();
                        }}
                        type="button"
                        className="hover:text-red-500 transition-all text-left hover:underline font-semibold capitalize"
                      >
                        Eliminar comprob.
                      </button>
                    </ul>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-6 font-medium text-gray-900 uppercase text-xs">
                  {p?.created_at?.split("T")[0]} / <strong>HORA:</strong>{" "}
                  {p?.created_at?.split("T")[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-center items-center space-x-2 pb-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-sky-300 py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-sky-400 hover:text-white focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft />
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-sky-200" : "bg-sky-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-white hover:bg-sky-500 focus:outline-none focus:bg-sky-300`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-sky-300 py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-sky-400 hover:text-white focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight />
        </button>
      </div>
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

      <ModalEliminarComprobante
        setComprobantes={setComprobantes}
        eliminarModal={isOpenComprobanteEliminar}
        closeEliminar={closeComprobanteEliminar}
        obtenerId={obtenerId}
        setDatos={setDatos}
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
        className="bg-sky-100 text-sky-600 py-2 px-5 rounded font-bold text-xs"
        onClick={() => setShowModal(true)}
      >
        VER COMPROBANTE
      </td>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 w-full flex justify-center relative">
            <button
              className="absolute top-0 right-0 m-4 text-red-700 bg-red-100 py-2 px-2 rounded-full hover:bg-red-200 transition-all ease-linear"
              onClick={() => setShowModal(false)}
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

export default ImagenModal;
