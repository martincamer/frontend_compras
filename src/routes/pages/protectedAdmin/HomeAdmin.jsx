import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { useProductosContext } from "../../../context/ProductosProvider";
import ApexChart from "../../../components/charts/ChartOne";
import ApexChartColumn from "../../../components/charts/ChartTwo";
import client from "../../../api/axios";
import ApexChartColumnProveedores from "../../../components/charts/ChartTree";
import ApexChartComprobantes from "../../../components/charts/ChartFourty";

export const HomeAdmin = () => {
  const { ordenesMensualesAdmin } = useOrdenesContext();
  const { proveedoresAdmin } = useProductosContext();
  const [comprobantesMensuales, setComprobantesMensuales] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get("/comprobantes-mes-admin");

      setComprobantesMensuales(respuesta.data);
    };
    obtenerDatos();
  }, []);

  const totalProveedores = proveedoresAdmin.reduce(
    (accumulator, currentValue) => {
      return accumulator + parseInt(currentValue.total);
    },
    0
  );

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

  const totalFinalAcumulado = ordenesMensualesAdmin.reduce((total, orden) => {
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

  console.log(ordenesMensualesAdmin);

  const calculateCategoryTotals = () => {
    const categoryTotals = {};

    // Iterate through invoices
    ordenesMensualesAdmin.forEach((invoice) => {
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
  const productosDeEstaSemana = ordenesMensualesAdmin
    .filter((orden) => new Date(orden.created_at) >= startOfWeek)
    .reduce((productos, orden) => {
      // Agrega todos los productos de las órdenes recientes al arreglo de productos
      const proveedor = orden.proveedor;
      const localidad = orden.localidad_usuario;
      const fabrica = orden.fabrica;

      orden.datos.productoSeleccionado.forEach((producto) => {
        productos.push({
          proveedor: proveedor,
          localidad: localidad,
          fabrica: fabrica,
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
    <section className="max-md:py-28 bg-gray-100/40 w-full h-full min-h-full max-h-full px-12 max-md:px-4 flex flex-col gap-12 max-md:gap-8 py-24">
      <div>
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="bg-white py-4 px-6 shadow-md border">
            <h2 className="text-xl font-bold text-sky-400 bg-white max-md:text-lg">
              Dashboard de compras del / todas las fabricas.
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
            value={ordenesMensualesAdmin.length}
            change={`${Number(ordenesMensualesAdmin.length % 100).toFixed(
              2
            )} %`}
            changeColor="bg-green-500"
            porcentaje={ordenesMensualesAdmin.length}
            color={"rgb(34 197 94)"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-28 max-md:hidden">
        <ApexChart ordenesMensuales={ordenesMensualesAdmin} />
        <ApexChartColumn ordenesMensuales={ordenesMensualesAdmin} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-10 z-0 max-md:grid-cols-1 max-md:gap-28 max-md:hidden">
        <ApexChartColumnProveedores
          totalProveedores={totalProveedores}
          proveedores={proveedoresAdmin}
        />
        <ApexChartComprobantes
          total={totalAcumulado}
          comprobantes={comprobantesMensuales}
        />
      </div>

      <div className="bg-white border shadow-lg py-10 px-10 rounded h-[80vh] overflow-y-scroll scroll-bar">
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
                <th>Localidad/Usuario</th>
                <th>Fabrica/Usuario</th>
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
                  <th>{p.localidad}</th>
                  <th>{p.fabrica}</th>
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
    <div className="xl:p-7.5 border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="mb-4 text-2xl max-md:text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <p className="font-medium text-gray-600 dark:text-gray-300 max-md:text-sm">
            {description}
          </p>
          <span className="mt-2 flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-md ${changeColor} p-1 text-xs font-medium text-white`}
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.0155 5.24683H9.49366C9.23116 5.24683 9.01241 5.72808C9.01241 5.99058 9.49366 6.20933H11.6593L8.85928 8.09058C8.74991 8.17808 8.59678 8.17808 8.46553 8.09058L5.57803 6.18745C5.11866 5.8812 4.54991 5.8812 4.09053 6.18745L0.721783 8.44058C0.503033 8.5937 0.437408 8.89995 0.590533 9.1187C0.678033 9.24995 0.831157 9.33745 1.00616 9.33745C1.09366 9.33745 1.20303 9.31558 1.26866 9.24995L4.65928 6.99683C4.76866 6.90933 4.92178 6.90933 5.05303 6.99683L7.94053 8.92183C8.39991 9.22808 8.96866 9.22808 9.42803 8.92183L12.5124 6.8437V9.27183V5.72808Z"
                  fill="white"
                />
              </svg>
              <span>{change}</span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 max-md:hidden">
              Porcentaje del mes
            </span>
          </span>
        </div>
        <div className="flex justify-center items-center">
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
        className="-absolute w-20 h-20 rounded-full bg-white"
        style={{ zIndex: 2 }}
      />

      {/* Texto en el centro */}
      <div
        className="absolute flex justify-center items-center"
        style={{ zIndex: 3 }}
      >
        <span className="text-lg font-bold text-gray-700 max-md:text-sm">
          {`${normalizedPercentage.toFixed(2)}%`}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
