import React from "react";
import ReactApexChart from "react-apexcharts";

// Componente funcional para ApexChart
const ApexChart = ({ ordenesMensuales }) => {
  // Crear un formateador para los valores en pesos
  const numberFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  // Generar datos para el gráfico
  const seriesData = ordenesMensuales.map((orden) =>
    parseFloat(orden.precio_final)
  );
  const categoriesData = ordenesMensuales.map(
    (orden) => orden.proveedor.toUpperCase() // Convertir a mayúsculas
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
      categories: categoriesData, // Categorías basadas en proveedores
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
      name: "Precio Final",
      data: seriesData, // Datos de precio final
    },
  ];

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

  return (
    <div className="bg-white py-10 px-10 z-[100] shadow-lg border relative rounded">
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
      </div>
      <div className="px-20 flex absolute left-0">
        <div className="border py-3 px-8 shadow-lg bg-white rounded">
          <p className="font-semibold text-base text-gray-500">
            Total final en ordenes
          </p>
          <p className="font-bold text-lg mt-1 text-sky-500">
            {totalFinalAcumulado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApexChart;
