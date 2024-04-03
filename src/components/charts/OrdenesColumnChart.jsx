import React from "react";
import Chart from "react-apexcharts";

const OrdenesColumnChart = ({ ordenesMensuales }) => {
  // Agrupar las ordenes por semana
  const ordenesPorSemana = ordenesMensuales.reduce((semanas, orden) => {
    const fecha = new Date(orden.created_at);
    const semana = getWeekStartDate(fecha); // Obtener la fecha de inicio de la semana
    semanas[semana] = semanas[semana] || [];
    semanas[semana].push(orden);
    return semanas;
  }, {});

  // Obtener los datos para el gráfico
  const datosPorSemana = Object.keys(ordenesPorSemana).map((semana) => {
    return {
      semana,
      ordenes: ordenesPorSemana[semana].map((orden) => ({
        fecha: orden.created_at,
        precio: parseFloat(orden.precio_final),
      })),
    };
  });

  // Configurar opciones del gráfico
  const options = {
    chart: {
      type: "bar",
      height: 200,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
        },
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumIntegerDigits: 2,
          });
        },
        style: {
          fontSize: "12px",
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%", // Anchura de las columnas
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  };

  // Configurar series del gráfico
  const series = datosPorSemana.map((datos) => ({
    name: "Total en la compra",
    data: datos.ordenes.map((orden) => ({
      x: new Date(orden.fecha).getTime(),
      y: orden.precio,
      fillColor: "#f97316", // Color naranja para las barras
    })),
  }));

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height={500}
      />
    </div>
  );
};

// Función para obtener la fecha de inicio de la semana
const getWeekStartDate = (date) => {
  const day = date.getDay(); // Obtener el día de la semana (0-6)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que la semana comience en lunes
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
};

export default OrdenesColumnChart;
