import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// Componente funcional para ApexChart
const ApexChart = ({ ordenesMensuales }) => {
  // Crear un formateador para valores en pesos
  const numberFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // Agrupar las órdenes por categoría y acumular el precio final
  const ordersByCategory = ordenesMensuales.reduce((acc, order) => {
    order.datos.productoSeleccionado.forEach((producto) => {
      const categoria = producto.categoria.toUpperCase();
      const precioFinal = parseFloat(producto.totalFinal);

      if (!acc[categoria]) {
        acc[categoria] = 0;
      }

      acc[categoria] += precioFinal;
    });

    return acc;
  }, {});

  // Obtener las categorías y los datos acumulados
  const categories = Object.keys(ordersByCategory);
  const seriesData = categories.map((category) => ordersByCategory[category]);

  // Configuración del gráfico ApexChart
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%", // Ancho de las columnas
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#38BDF8"], // Color de las barras (sky-300)
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#000",
          fontWeight: "bold",
          // Color del texto en negro
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => numberFormatter.format(value), // Formato de pesos
        style: {
          colors: "#000",
          // Color del texto del eje Y
        },
      },
      title: {
        text: "Total acumulado por categorias (Pesos)", // Título del eje Y
        style: {
          color: "#000", // Color del texto del título
          fontWeight: "bold",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => numberFormatter.format(value), // Formato del tooltip en pesos
      },
    },
  };

  const series = [
    {
      name: "Total final acumulado en pesos",
      data: seriesData, // Datos acumulados por categoría
    },
  ];

  return (
    <div className="bg-white py-10 px-10 z-[100] border-gray-300 border relative rounded">
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexChart;
