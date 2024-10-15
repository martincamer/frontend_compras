import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import ApexChart from "../../../components/charts/ChartOne";
import ApexChartColumn from "../../../components/charts/ChartTwo";
import ApexChartColumnProveedores from "../../../components/charts/ChartTree";
import ApexChartComprobantes from "../../../components/charts/ChartFourty";
import client from "../../../api/axios";

export const HomeAdmin = () => {
  const [ordenes, setOrdenes] = useOrdenesContext();
  const { proveedores } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/ordenes-admin");

      setOrdenes(respuesta.data);
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
    <section className="w-full min-h-full max-h-full flex flex-col gap-12 max-md:gap-8 h-[100vh] overflow-y-scroll scroll-bar max-md:h-auto">
      <div>
        <div className="bg-gray-100 py-10 px-10 mb-10 flex justify-between items-center max-md:flex-col max-md:gap-3 max-md:mb-0 ">
          <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ">
            Panel de compras.
          </p>
        </div>
        <div className="flex gap-2 mb-5 w-1/4 max-md:w-full px-10 max-md:px-5 max-md:pt-5">
          <input
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            type="date"
            className="outline-none w-full max-md:text-sm uppercase bg-white border border-gray-300 text-gray-600 py-2 px-2 rounded-md focus:shadow-md text-sm font-bold appearance-none relative cursor-pointer"
            placeholder="Fecha de inicio"
          />
          <input
            value={fechaFin}
            onChange={handleFechaFinChange}
            type="date"
            className="outline-none w-full max-md:text-sm uppercase bg-white border border-gray-300 text-gray-600 py-2 px-2 rounded-md focus:shadow-md text-sm font-bold appearance-none relative cursor-pointer"
            placeholder="Fecha de inicio"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-2 xl:grid-cols-3 px-10 max-md:px-5">
          {/* Tarjeta 1 */}
          <Card
            description="Total en compras."
            value={totalFinalAcumulado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalFinalAcumulado % 100).toFixed(2)} %`}
            changeColor="bg-gradient-to-r from-primary to-blue-600" // Gradient from red-400 to red-600
            porcentaje={totalFinalAcumulado}
            color={"rgb(220 38 38 / 0.8)"}
            textColor="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent" // Gradient for text
            colorTitle="bg-gradient-to-r from-red-500 to-red-200 bg-clip-text text-transparent"
          />

          {/* Tarjeta 2 */}
          <Card
            description="Deuda total proveedores."
            value={totalProveedores.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalProveedores % 100).toFixed(2)} %`}
            changeColor="bg-gradient-to-r from-primary to-blue-600" // Gradient from red-400 to red-600
            color={"rgb(220 38 38 / 0.8)"}
            porcentaje={totalProveedores}
            textColor="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent" // Gradient for text
            colorTitle="bg-gradient-to-r from-red-500 to-red-200 bg-clip-text text-transparent"
          />

          {/* Tarjeta 2 */}
          <Card
            description="Total pagado a proveedores."
            value={totalAcumulado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            change={`${Number(totalAcumulado % 100).toFixed(2)} %`}
            changeColor="bg-gradient-to-r from-yellow-600 to-green-600" // Gradient from red-400 to red-600
            color={"rgb(34 197 94)"}
            porcentaje={totalAcumulado}
            textColor="bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent" // Gradient for text
            colorTitle="bg-gradient-to-r from-green-400 to-yellow-600 bg-clip-text text-transparent"
          />

          <Card
            description="Total ordenes generadas."
            value={ordenes.length}
            change={`${Number(ordenes.length % 100).toFixed(2)} %`}
            changeColor="bg-gradient-to-r from-yellow-600 to-green-600" // Gradient from red-400 to red-600
            porcentaje={ordenes.length}
            color={"rgb(34 197 94)"}
            textColor="bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent"
            colorTitle="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-0 z-0 max-md:grid-cols-1 max-md:gap-16 max-md:hidden px-10">
        <ApexChart ordenesMensuales={filteredDataRemuneraciones} />
        <ApexChartColumn ordenesMensuales={filteredDataRemuneraciones} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-20 max-md:hidden px-10">
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
  textColor,
  colorTitle,
}) => {
  return (
    <div className="xl:p-7.5 bg-gray-800 dark:border-gray-600 dark:bg-gray-800 md:p-6 max-md:p-3 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`mb-2 text-3xl font-bold ${colorTitle} max-md:text-xl`}
          >
            {value}
          </h3>
          <p className="font-bold bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent dark:from-green-300 dark:to-blue-400 max-md:text-sm">
            {description}
          </p>
          <span className="mt-2 flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-md ${changeColor} px-2 py-1 text-xs font-medium text-white`}
            >
              <span>{change}</span>
            </span>
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-300 to-blue-400 bg-clip-text text-transparent dark:from-pink-300 dark:to-purple-400 max-md:text-xs">
              Porcentaje.
            </span>
          </span>
        </div>
        <div className="flex justify-center items-center max-md:hidden">
          <CircularProgress
            textColor={textColor}
            color={color}
            percentage={porcentaje}
          />
        </div>
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, color, textColor }) => {
  // Ensure the percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Calculate the progress angle
  const progressAngle = `${(normalizedPercentage / 100) * 360}deg`;

  // Circle size
  const circleSize = "100px"; // Outer circle size

  // Progress circle gradient style
  const progressStyle = {
    backgroundImage: `conic-gradient(
      ${color} ${progressAngle},
      transparent ${progressAngle}
    )`,
  };

  return (
    <div
      className="relative flex justify-center items-center rounded-full bg-gray-200"
      style={{ width: circleSize, height: circleSize }}
    >
      {/* Progress circle background */}
      <div
        className="absolute w-full h-full rounded-full"
        style={{ ...progressStyle, zIndex: 1 }}
      />

      {/* Inner circle for the thicker progress bar */}
      <div
        className="absolute w-[90px] h-[90px] rounded-full bg-gray-800"
        style={{ zIndex: 2 }}
      />

      {/* Center text displaying the percentage */}
      <div
        className="absolute flex justify-center items-center"
        style={{ zIndex: 3 }}
      >
        <span className={`text-md font-extrabold ${textColor}`}>
          {`${normalizedPercentage.toFixed(2)}%`}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
