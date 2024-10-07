import React from "react";
import ReactApexChart from "react-apexcharts";

// Componente funcional para ApexChart
const ApexChartComprobantes = ({ comprobantes, total }) => {
  // Crear un formateador para los valores en pesos
  const numberFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  // Generar datos para el gráfico
  const seriesData = comprobantes.map((orden) => parseFloat(orden.total));

  // Generar categorías que incluyan el proveedor y la fecha de creación
  const categoriesData = comprobantes.map(
    (orden) =>
      `${orden?.proveedor?.toUpperCase()} - ${new Date(
        orden?.created_at
      ).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })}` // Convertir a mayúsculas y agregar fecha
  );

  // Configuración de ApexChart
  const chartOptions = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: categoriesData, // Categorías con nombre del proveedor y fecha
    },
    tooltip: {
      y: {
        formatter: (value) => numberFormatter.format(value), // Formato de moneda
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => numberFormatter.format(value), // Convertir el eje Y a pesos
      },
    },
  };

  // Define la serie con el precio final
  const series = [
    {
      name: "Total del comprobante/pago",
      data: seriesData, // Datos de precio final
    },
  ];

  return (
    <div className="z-[100] relative rounded-2xl">
      <div
        id="chart"
        className="bg-white py-5 px-5 rounded-2xl border border-gray-300"
      >
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={450}
        />
      </div>
      {/* <div className="px-20 flex absolute left-0 bottom-[-34px] max-md:hidden">
        <div className="border py-3 px-8 shadow-lg bg-white rounded">
          <p className="font-semibold text-base text-gray-500">
            Total final en pagos/comprobantes
          </p>
          <p className="font-bold text-lg mt-1 text-blue-500">
            {total.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default ApexChartComprobantes;
