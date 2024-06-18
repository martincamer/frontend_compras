import ReactApexChart from "react-apexcharts";
import React from "react";

// Función para formatear valores a pesos argentinos
const formatToPesos = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

const ApexChartColumnProveedores = ({ proveedores, totalProveedores }) => {
  // Transformar los datos de proveedores para obtener las categorías y series para el gráfico
  const categories = proveedores.map((p) => p.proveedor.toUpperCase()); // Convertir a mayúsculas
  const seriesData = proveedores.map((p) => parseFloat(p.total)); // Convertir el total a número

  const chartOptions = {
    chart: {
      type: "bar",
      height: 400,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true, // Gráfico horizontal
        barHeight: "10%", // Ancho de la barra ajustado al 10% del contenedor
        colors: {
          ranges: [
            {
              from: 0,
              to: Infinity, // Aplicar color a todas las barras
              color: "#DC143C", // Rojo más oscuro
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false, // Deshabilitar etiquetas de datos
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "14px", // Tamaño de la letra
          fontWeight: "bold", // Negrita para el texto
        },
      },
      title: {
        text: "Total que debemos a los proveedores",
        style: {
          fontSize: "14px",
        },
      },
      tickAmount: 6, // Número de ticks en el eje X
      labels: {
        formatter: (value) => formatToPesos(value), // Formatear valores del eje X a pesos argentinos
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatToPesos(value), // Formatear tooltip a pesos argentinos
      },
    },
  };

  const series = [
    {
      data: seriesData, // Datos para el gráfico
    },
  ];

  return (
    <div className="bg-white shadow-xl border py-5 px-5 relative mb-6 h-full">
      <div className="overflow-y-scroll h-[50vh] scroll-bar" id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={3000}
        />
      </div>

      <div className="px-20 flex absolute left-0 max-md:hidden">
        <div className="border py-3 px-8 shadow-lg bg-white rounded">
          <p className="font-semibold text-base text-gray-500">
            Total deuda con proveedores
          </p>
          <p className="font-bold text-lg mt-1 text-red-700">
            {totalProveedores.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApexChartColumnProveedores;
