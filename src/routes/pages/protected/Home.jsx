import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import ApexChart from "../../../components/charts/ChartOne";
import ApexChartColumn from "../../../components/charts/ChartTwo";
import client from "../../../api/axios";
import ApexChartColumnProveedores from "../../../components/charts/ChartTree";
import ApexChartComprobantes from "../../../components/charts/ChartFourty";

export const Home = () => {
  const { ordenesMensuales } = useOrdenesContext();
  const { proveedores } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes-mes");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

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

  console.log(ordenesMensuales);

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

  // Call the function to category totals
  const categoryTotalsData = calculateCategoryTotals();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Determina la semana actual
  const getStartOfWeek = (date) => {
    const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para que la semana comience el lunes
    return new Date(date.setDate(diff));
  };

  // Filtra productos cargados en la semana actual y agrega el proveedor
  const startOfWeek = getStartOfWeek(new Date());
  const productosDeEstaSemana = ordenesMensuales
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

  const totalAcumulado = comprobantesMensuales.reduce((acumulado, item) => {
    const totalNum = parseFloat(item.total); // Convertir a número
    return acumulado + totalNum;
  }, 0); // Inicia la acumulación desde cero

  return (
    <section className="bg-gray-100/40 w-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-10 h-[100vh] overflow-y-scroll scroll-bar max-md:py-20">
      <div>
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="bg-white py-4 px-6 shadow-xl max-md:py-2 max-md:px-2 max-md:text-center">
            <h2 className="text-xl font-bold text-sky-400 bg-white max-md:text-sm">
              Dashboard de compras del mes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
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
            value={ordenesMensuales.length}
            change={`${Number(ordenesMensuales.length % 100).toFixed(2)} %`}
            changeColor="bg-green-500"
            porcentaje={ordenesMensuales.length}
            color={"rgb(34 197 94)"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-16">
        <ApexChart ordenesMensuales={ordenesMensuales} />
        <ApexChartColumn ordenesMensuales={ordenesMensuales} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-20">
        <ApexChartColumnProveedores
          totalProveedores={totalProveedores}
          proveedores={proveedores}
        />
        <ApexChartComprobantes
          total={totalAcumulado}
          comprobantes={comprobantesMensuales}
        />
      </div>

      <div className="bg-white border shadow-lg py-10 px-10 rounded">
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
    <div className="xl:p-7.5 shadow-xl bg-white dark:border-gray-600 dark:bg-gray-800 md:p-6 max-md:p-3 rounded">
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
