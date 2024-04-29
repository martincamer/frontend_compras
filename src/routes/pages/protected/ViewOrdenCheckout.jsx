import { useEffect, useState } from "react";
import client from "../../../api/axios";
import { Link, useParams } from "react-router-dom";
import { ModalEditarEntrega } from "../../../components/Modales/ModalEditarEntrega";
import { ToastContainer } from "react-toastify";

export const ViewOrdenCheckout = () => {
  const [orden, setOrden] = useState([]);
  const [isEntrega, setIsEntega] = useState(false);
  const [OBTENERID, setObtenerId] = useState(null);

  const openEntrega = () => setIsEntega(true);
  const closeEntrega = () => setIsEntega(false);

  const handleID = (id) => setObtenerId(id);

  const params = useParams();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/orden/${params.id}`);

      setOrden(res.data);
    }
    loadData();
  }, [params.id]);

  console.log(orden);

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

  return (
    <section className="bg-gray-100/50 min-h-scren max-h-full w-full h-full px-5 flex flex-col gap-2 py-16 max-md:gap-5 max-md:py-10 max-md:px-0">
      <ToastContainer />
      <nav aria-label="Breadcrumb" className="flex px-5 max-md:px-5">
        <ol className="flex overflow-hidden rounded-xl border bg-slate-300 text-gray-600 shadow max-md:shadow-none">
          <li className="flex items-center">
            <Link
              to={"/"}
              className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <span className="ms-1.5 text-xs font-medium"> INICIO </span>
            </Link>
          </li>

          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>

            <Link
              to={"/ordenes-checkout"}
              href="#"
              className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
            >
              ORDENES CHECKOUT
            </Link>
          </li>
        </ol>
      </nav>
      <div className="py-5 px-5 rounded-xl grid grid-cols-4 gap-3 mb-2 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-5">
        <article className="flex flex-col justify-center shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-8 px-6">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium max-md:text-xs">
              {Number(orden.precio_final / 100000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Total de la compra
            </strong>

            <div className="max-md:flex-col max-md:gap-1 max-md:flex">
              <span className="text-xl font-medium text-red-600 max-md:text-base max-md:font-bold">
                {Number(orden.precio_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                final gastado{" "}
                <span className="font-bold text-slate-700">
                  {Number(orden.precio_final).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </span>
              </span>
            </div>
          </div>
        </article>

        <article className="flex flex-col justify-center shadow-lg hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-4 px-6">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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
              {nombreMesActual}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs uppercase">
              Fecha Actual
            </strong>

            <p>
              <span className="text-xl max-md:text-base font-medium text-gray-900 uppercase">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500 uppercase">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="max-md:w-auto bg-white w-1/5 mt-4 border-slate-300 transition-all ease-linear cursor-pointer hover:shadow-md border-[1px] py-5 px-5 shadow-lg mx-4 max-md:mx-0">
        <div>
          <h5 className="underline text-sky-400 font-semibold text-lg">
            DATOS DE LA COMPRA
          </h5>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Numero de la compra: </span>
            {orden.id}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Proveedor: </span>
            {orden.proveedor}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Localidad: </span>
            {orden.localidad}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Provincia: </span>
            {orden.provincia}
          </p>

          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Numero Fact/Remito: </span>
            N° {orden.numero_factura}
          </p>
          <p className="text-slate-700 text-base uppercase">
            <span className="font-bold">Fecha de la factura: </span>
            {new Date(orden?.fecha_factura).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>

      <div className="mt-4 py-5 px-5 max-md:px-0 mx-0">
        <div>
          <h5 className="underline text-sky-400 font-semibold text-lg max-md:px-5">
            PRODUCTOS
          </h5>

          <ProductCards
            handleID={handleID}
            openEntrega={openEntrega}
            products={orden}
          />

          <div className="overflow-x-auto rounded-2xl border border-slate-300 mt-5 hover:shadow-md transition-all ease-linear cursor-pointer max-md:hidden">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  {/* <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CODIGO
                  </th> */}
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CATEGORIA
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    DETALLE
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CANTIDAD
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    CANTIDAD ENTREGADA
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    OPCIONES
                  </th>
                  <th className="whitespace-nowrap px-4 py-4 text-slate-800 font-semibold text-left">
                    ESTADO
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orden?.datos?.productoSeleccionado?.map((p, index) => (
                  <tr key={index}>
                    {/* <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 text-sm">
                      {p.id}
                    </td> */}
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.categoria}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.detalle}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                      {p.cantidad}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 font-bold uppercase text-sm">
                      {p.cantidadFaltante}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm flex gap-2">
                      <button
                        onClick={() => {
                          handleID(p.id), openEntrega();
                        }}
                        className="text-sm font-normal py-2 px-4 rounded-xl bg-green-100 text-green-700"
                        type="button"
                      >
                        EDITAR/ENTREGADA
                      </button>
                    </td>
                    <td
                      className={` whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm`}
                    >
                      <span
                        className={`${
                          p.cantidad === p.cantidadFaltante
                            ? " bg-green-100 py-2 font-semibold px-4 rounded-xl  text-green-600 text-sm"
                            : "bg-orange-100 py-2 font-semibold px-4 rounded-xl  text-orange-700 text-sm"
                        }`}
                      >
                        {p.cantidad === p.cantidadFaltante
                          ? "FINALIZADO"
                          : "PENDIENTE"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalEditarEntrega
        setOrden={setOrden}
        orden={orden}
        closeModal={closeEntrega}
        isOpen={isEntrega}
        OBTENERID={OBTENERID}
      />
    </section>
  );
};

const ProductCard = ({ product, openEntrega, handleID }) => (
  <div className="bg-white p-6 border border-gray-200 transition hover:shadow-xl">
    <h3 className="font-bold text-lg text-slate-700 mb-2">
      Categoría: {product.categoria}
    </h3>
    <p className="text-slate-600">Detalle: {product.detalle}</p>
    <p className="text-slate-600">Cantidad: {product.cantidad}</p>
    <p className="text-slate-600">
      Cantidad Entregada: {product.cantidadFaltante}
    </p>
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => {
          handleID(product.id), openEntrega();
        }}
        className="text-sm font-normal py-2 px-4 rounded-xl bg-green-100 text-green-700"
        type="button"
      >
        EDITAR/ENTREGADA
      </button>
    </div>
    <div className="mt-4">
      <span
        className={`${
          product.cantidad === product.cantidadFaltante
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700"
        } py-2 font-semibold px-4 rounded-xl text-sm`}
      >
        {product.cantidad === product.cantidadFaltante
          ? "FINALIZADO"
          : "PENDIENTE"}
      </span>
    </div>
  </div>
);

const ProductCards = ({ products, openEntrega, handleID }) => (
  <div className="mt-4 py-5 px-0 mx-0 md:hidden">
    <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.datos?.productoSeleccionado.map((product, index) => (
        <ProductCard
          handleID={handleID}
          openEntrega={openEntrega}
          key={index}
          product={product}
        />
      ))}
    </div>
  </div>
);
