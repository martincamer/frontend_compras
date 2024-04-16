import { useEffect, useState } from "react";
import PogressBar from "../../../components/charts/PogressBar";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";

export const Home = () => {
  const { ordenesMensuales } = useOrdenesContext();
  const { proveedores } = useProductosContext();

  const totalProveedores = proveedores.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.total);
  }, 0);

  console.log(totalProveedores);

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

  const totalFinalAcumulado = ordenesMensuales.reduce((total, orden) => {
    if (orden.datos && orden.datos.productoSeleccionado) {
      const totalOrden = orden.datos.productoSeleccionado.reduce(
        (subtotal, producto) => {
          return subtotal + parseInt(producto.totalFinal);
        },
        0
      );
      return total + totalOrden;
    }
    return total;
  }, 0);

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterate through invoices
    ordenesMensuales.forEach((invoice) => {
      // Extract product details
      const products = invoice.datos.productoSeleccionado;

      // Iterate through products
      products.forEach((product) => {
        const category = product.categoria;
        const totalFinal = parseInt(product.totalFinal);

        // Update total spent for the category
        if (category in categoryTotals) {
          categoryTotals[category] += totalFinal;
        } else {
          categoryTotals[category] = totalFinal;
        }
      });
    });

    // Convert categoryTotals to array format
    const categoryTotalsArray = Object.keys(categoryTotals).map((category) => ({
      category,
      total: categoryTotals[category],
    }));

    return categoryTotalsArray;
  };

  // Call the function to gsssssssssssssset category totals
  const categoryTotalsData = calculateCategoryTotals();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-24">
      <div className="rounded-xl bg-white grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
        {[1, 2, 3, 4, 5].map((index) => (
          <article
            key={index}
            className="animate-pulse flex items-center justify-between gap-4 rounded-xl border-[1px] border-slate-300 bg-white p-8 hover:shadow-md transition-all ease-linear cursor-pointer"
          >
            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-gray-200 animate-pulse w-9 h-9"></div>
              <div>
                <div className="bg-gray-200 animate-pulse h-8 w-24"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-20"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end rounded-xl bg-gray-200 py-2 px-2 text-gray-200 animate-pulse">
              <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-4 bg-gray-300 animate-pulse"></div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 items-start gap-5 overflow-y-scroll pb-4">
        <div className="h-[500px] border-slate-300 border-[1px] py-5 px-5 rounded-xl flex flex-col gap-12 hover:shadow-md transition-all ease-linear cursor-pointer">
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse flex flex-col gap-5">
              <div className="bg-gray-200 rounded-xl h-3"></div>
              <div className="bg-gray-200 rounded-xl h-3"></div>
              <div className="bg-gray-200 rounded-xl h-3"></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="animate-pulse flex items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white p-6 hover:shadow-md transition-all ease-linear cursor-pointer"
            >
              <div className="rounded-full bg-gray-200 animate-pulse w-9 h-9"></div>
              <div>
                <div className="bg-gray-200 animate-pulse h-8 w-24"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-24">
      <div className="rounded-xl bg-white grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-2 max-md:px-0">
        <article className="flex items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white p-6 hover:shadow-md transition-all ease-linear cursor-pointer">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-3 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-red-700">
                {Number(totalFinalAcumulado).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en compras del mes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end rounded-xl bg-red-100 py-2 px-2 text-red-600">
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
              {Number(totalFinalAcumulado / 1000000).toFixed(2)} %{" "}
            </span>
          </div>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-green-100 p-3 text-green-700">
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-green-700">
                {Number(ordenesMensuales.length)}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total en compras del mes
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
              {Number(ordenesMensuales.length / 1).toFixed(2)} %{" "}
            </span>
          </div>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="mt-2 h-[50px] overflow-y-scroll">
            <p className="">
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                <ul className="flex flex-col gap-1">
                  {categoryTotalsData.map((category) => (
                    <li
                      className="uppercase text-sm text-slate-600"
                      key={category.category}
                    >
                      <span className="font-bold">{category.category}:</span>{" "}
                      <p className="text-red-600">
                        {" "}
                        {Number(category.total).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              </span>
            </p>
          </div>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-indigo-100 p-3 text-indigo-700">
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
              <p className="text-2xl font-medium text-indigo-700 uppercase">
                {nombreMesActual}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                MES ACTUAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end rounded-xl bg-indigo-100 py-2 px-4 text-indigo-600">
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

        <article className="flex items-center justify-between gap-4 rounded-2xl hover:shadow-md transition-all ease-linear cursor-pointer border border-slate-300 bg-white py-9 px-6">
          <div className="flex gap-4 items-center">
            <span className="rounded-full bg-red-100 p-3 text-red-700">
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
                  d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
                />
              </svg>
            </span>

            <div>
              <p className="text-2xl font-medium text-red-700">
                {" "}
                {Number(totalProveedores).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </p>

              <p className="text-sm text-gray-500 uppercase underline">
                Total deuda proveedores
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end rounded-xl bg-red-100 py-2 px-2 text-red-600">
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
              {Number(totalProveedores / 1000000).toFixed(2)} %{" "}
            </span>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-2 items-start gap-5 pb-4">
        <div className="h-[500px] overflow-y-scroll border-slate-300 border-[1px] py-5 px-5 rounded-2xl flex flex-col gap-12 hover:shadow-md transition-all ease-linear cursor-pointer">
          <div className="text-2xl font-medium text-gray-900 max-md:text-base flex flex-col gap-5">
            {categoryTotalsData.map((category) => (
              <div key={category.category}>
                <p className="uppercase text-sm text-slate-600">
                  {category.category}:
                </p>
                <progress
                  className="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg rounded-full  [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400 w-full h-3"
                  value={Number(category.total)}
                  max={20000000}
                ></progress>
                <div>
                  <p className="text-xs text-slate-700 px-2 py-1 font-semibold">
                    {`${category.total.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })} (${((Number(category.total) / 20000000) * 100).toFixed(
                      2
                    )}%)`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <PogressBar ordenesMensuales={ordenesMensuales} />
        </div>
      </div>
    </section>
  );
};
