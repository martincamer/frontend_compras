import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import ApexChart from "../../../components/charts/ChartOne";
import ApexChartColumn from "../../../components/charts/ChartTwo";
import ApexChartColumnProveedores from "../../../components/charts/ChartTree";
import ApexChartComprobantes from "../../../components/charts/ChartFourty";
import client from "../../../api/axios";

export const Home = () => {
  const { ordenes } = useOrdenesContext();
  const { proveedores } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // Filtro por rango de fechas (si están definidas)
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = new Date(fechaFin);

  let filteredDataRemuneraciones = ordenes.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // let filteredDataProveedores = proveedores.filter((item) => {
  //   const fechaOrden = new Date(item.created_at);
  //   return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  // });

  let filteredDataComprobantes = comprobantesMensuales.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  const totalAcumulado = filteredDataComprobantes.reduce((acumulado, item) => {
    const totalNum = parseFloat(item.total); // Convertir a número
    return acumulado + totalNum;
  }, 0); // Inicia la acumulación desde cero

  const totalProveedores = proveedores.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.total);
  }, 0);

  const totalFinalAcumulado = filteredDataRemuneraciones.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.precio_final);
    },
    0
  );

  // Determina la semana actual
  const getStartOfWeek = (date) => {
    const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para que la semana comience el lunes
    return new Date(date.setDate(diff));
  };

  // Filtra productos cargados en la semana actual y agrega el proveedor
  const startOfWeek = getStartOfWeek(new Date());

  const productosDeEstaSemana = ordenes
    .filter((orden) => new Date(orden.created_at) >= startOfWeek)
    .reduce((productos, orden) => {
      // Agrega todos los productos de las órdenes recientes al arreglo de productos
      const proveedor = orden.proveedor;
      orden.datos.productoSeleccionado.forEach((producto) => {
        productos.push({
          proveedor: proveedor,
          nombre: producto.detalle,
          precio: parseFloat(producto.precio_und),
          cantidad: parseInt(producto.cantidad),
        });
      });
      return productos;
    }, []);

  return (
    <section className="w-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-10 h-[100vh] overflow-y-scroll scroll-bar max-md:py-5">
      <div>
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-gray-800 py-5 px-5 rounded-md">
          <div className="bg-white py-4 px-4 rounded-md max-md:py-2 max-md:px-2 max-md:text-center">
            <h2 className="text-xl font-bold text-primary bg-white max-md:text-sm">
              Panel de compras
            </h2>
          </div>
        </div>
        <div className="flex gap-2 my-2 w-1/4 max-md:w-full">
          <input
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white border-gray-300 border py-2 px-2 rounded-md focus:shadow-md text-sm font-bold"
            placeholder="Fecha de inicio"
          />
          <input
            value={fechaFin}
            onChange={handleFechaFinChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white border-gray-300 border py-2 px-2 rounded-md focus:shadow-md text-sm font-bold"
            placeholder="Fecha fin"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-2 xl:grid-cols-3">
          {/* Tarjeta 1 */}
          <Card
            description="Total gasto en compras del mes"
            value={totalFinalAcumulado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalFinalAcumulado % 100).toFixed(2)} %`}
            changeColor="bg-red-500"
            porcentaje={totalFinalAcumulado}
            color={"rgb(220 38 38 / 0.8)"}
          />

          {/* Tarjeta 2 */}
          <Card
            description="Deuda total proveedores"
            value={totalProveedores.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalProveedores % 100).toFixed(2)} %`}
            changeColor="bg-red-500"
            color={"rgb(220 38 38 / 0.8)"}
            porcentaje={totalProveedores}
          />

          {/* Tarjeta 2 */}
          <Card
            description="Total pagado a proveedores"
            value={totalAcumulado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalAcumulado % 100).toFixed(2)} %`}
            changeColor="bg-green-500"
            color={"rgb(34 197 94)"}
            porcentaje={totalAcumulado}
          />

          <Card
            description="Total ordenes generadas en el mes"
            value={ordenes.length}
            change={`${Number(ordenes.length % 100).toFixed(2)} %`}
            changeColor="bg-green-500"
            porcentaje={ordenes.length}
            color={"rgb(34 197 94)"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-16">
        <ApexChart ordenesMensuales={filteredDataRemuneraciones} />
        <ApexChartColumn ordenesMensuales={filteredDataRemuneraciones} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-20">
        <ApexChartColumnProveedores
          totalProveedores={totalProveedores}
          proveedores={proveedores}
        />
        <ApexChartComprobantes
          total={totalAcumulado}
          comprobantes={filteredDataComprobantes}
        />
      </div>

      <div className="bg-white py-10 px-10 rounded hidden">
        <div>
          <p className="font-semibold text-gray-800 mb-4">
            Reporte de productos cargados en la semana.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="text-sm">
                <th>Proveedor</th>
                <th>Producto comprado</th>
                <th>Cantidad del producto</th>
                <th>Total final</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productosDeEstaSemana.map((p) => (
                <tr className="text-sm uppercase">
                  <th>{p.proveedor}</th>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td className="font-bold">
                    {p.precio.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="flex">
                    <p className="bg-green-100 py-2 px-6 rounded-full text-green-700 font-medium">
                      aprobado
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Card = ({
  description,
  value,
  change,
  changeColor,
  porcentaje,
  color,
}) => {
  return (
    <div className="xl:p-7.5 bg-white dark:border-gray-600 dark:bg-gray-800 md:p-6 max-md:p-3 rounded border border-gray-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white max-md:text-xl">
            {value}
          </h3>
          <p className="font-medium text-gray-600 dark:text-gray-300 max-md:text-sm">
            {description}
          </p>
          <span className="mt-2 flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-md ${changeColor} px-2 py-1 text-xs font-medium text-white`}
            >
              <span>{change}</span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 max-md:text-xs">
              Porcentaje del mes
            </span>
          </span>
        </div>
        <div className="flex justify-center items-center max-md:hidden">
          <CircularProgress color={color} percentage={porcentaje} />
        </div>
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, color }) => {
  // Asegura que el porcentaje esté entre 1 y 100
  const normalizedPercentage = percentage % 100 || 100;

  // Cálculo del ángulo de progreso
  const progressAngle = `${(normalizedPercentage / 100) * 360}deg`;

  // Tamaño de la barra de progreso
  const circleSize = "100px"; // Tamaño del círculo exterior

  // Estilo para el círculo de progreso
  const progressStyle = {
    backgroundImage: `conic-gradient(
      ${color} ${progressAngle},
      transparent 0
    )`,
  };

  return (
    <div
      className="relative flex justify-center items-center rounded-full bg-gray-200"
      style={{ width: circleSize, height: circleSize }}
    >
      {/* Fondo del círculo de progreso */}
      <div
        className="absolute w-full h-full rounded-full"
        style={{ ...progressStyle, zIndex: 1 }}
      />

      {/* Anillo interior para crear la barra gruesa */}
      <div
        className="-absolute w-[90px] h-[90px] rounded-full bg-white"
        style={{ zIndex: 2 }}
      />

      {/* Texto en el centro */}
      <div
        className="absolute flex justify-center items-center"
        style={{ zIndex: 3 }}
      >
        <span className="text-md font-bold text-gray-700">
          {`${normalizedPercentage.toFixed(2)}%`}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
