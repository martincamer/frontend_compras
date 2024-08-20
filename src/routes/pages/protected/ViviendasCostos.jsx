import { FaSearch } from "react-icons/fa";
import { useProductosContext } from "../../../context/ProductosProvider";
import { useEffect, useState } from "react";
import { useObtenerId } from "../../../helpers/obtenerId";
import { useForm } from "react-hook-form";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { FaDeleteLeft } from "react-icons/fa6";
import { showSuccessToast } from "../../../helpers/toast";
import { IoCloudDone } from "react-icons/io5";
import client from "../../../api/axios";
import { PDFViewer } from "@react-pdf/renderer";
import { ImprimirPdfViviendasPdf } from "../../../components/pdf/ImprimirViviendasPdf";

export const ViviendasCostos = () => {
  const [viviendas, setViviendas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await client.get("/viviendas");
      setViviendas(res.data);
    };
    obtenerDatos();
  }, []);

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Sector de modelos.</p>
        <button
          onClick={() => document.getElementById("my_modal_modelo").showModal()}
          type="button"
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Crear nuevo modelo
        </button>
      </div>

      <div className="mt-10 px-10 flex gap-2 max-md:flex-col">
        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
          <input
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar modelo por el nombre..."
          />
          <FaSearch className="text-gray-700" />
        </div>
      </div>

      <div>
        <div className="max-md:overflow-x-auto px-10 py-2 max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr className="">
                <th>Codigo</th>
                <th>Modelo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody className="text-xs capitalize font-medium">
              {viviendas.map((v) => (
                <tr>
                  <td>{v.id}</td>
                  <td>{v.nombre_modelo}</td>
                  <td>
                    <div>
                      <button
                        onClick={() => {
                          handleObtenerId(v.id),
                            document
                              .getElementById("my_modal_ver_modelo")
                              .showModal();
                        }}
                        className="bg-primary py-2 px-4 rounded-md text-white font-semibold"
                      >
                        Ver modelo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalCrearModelo />
      <VerModelo idObtenida={idObtenida} />
    </section>
  );
};

const VerModelo = ({ idObtenida }) => {
  const { productos } = useProductosContext();
  //useState
  const [vivienda, setVivienda] = useState([]);
  //useEffect
  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await client.get(`/viviendas/${idObtenida}`);

      setVivienda(res.data);
      console.log("aberturas", res.data);
    };
    obtenerDatos();
  }, [idObtenida]);

  // Función para actualizar precios si son diferentes
  const actualizarPrecios = (materiaPrima, productos) => {
    return materiaPrima.map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      if (
        producto &&
        parseFloat(item.precio_und) !== parseFloat(producto.precio_und)
      ) {
        return {
          ...item,
          precio_und: parseFloat(producto.precio_und).toFixed(2),
        };
      }
      return item;
    });
  };

  const calcularSubtotal = (items) => {
    return items.reduce(
      (total, item) =>
        total + parseFloat(item.precio_und) * parseFloat(item.cantidad),
      0
    );
  };

  let materiaPrima = [];
  let bienesDeUso = [];

  try {
    // Primero, eliminamos las comillas externas y decodificamos el JSON dentro de las comillas
    const cleanedMateriaPrima = vivienda.productos_materia_prima;

    const cleanedBienesDeUso = vivienda.productos_bienes_de_uso;

    // Parsear las cadenas JSON internas
    materiaPrima = JSON.parse(cleanedMateriaPrima);
    bienesDeUso = JSON.parse(cleanedBienesDeUso);

    console.log("asdsaddasdasdsadsadassadas", materiaPrima);
    console.log("asdasdasd", bienesDeUso);
  } catch (error) {
    console.error("Error al parsear JSON:", error);
  }

  // Actualizar precios
  const materiaPrimaActualizado = actualizarPrecios(materiaPrima, productos);
  const bienesDeUsoActualizado = actualizarPrecios(bienesDeUso, productos);

  // Calcular subtotales
  const subtotalMateriaPrima = calcularSubtotal(materiaPrimaActualizado);
  const subtotalBienesDeUso = calcularSubtotal(bienesDeUsoActualizado);

  console.log("MATERIA PRIMA ACTUALIZADA", materiaPrimaActualizado);
  return (
    <dialog id="my_modal_ver_modelo" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Modelo obtenido{" "}
          <span className="text-primary capitalize">
            {vivienda.nombre_modelo}.
          </span>
        </h3>

        <h2 className="mt-4 underline font-bold text-blue-500 text-lg">
          Materia Prima
        </h2>
        <table className="table">
          <thead>
            <tr className="font-bold text-gray-800 text-base">
              <th>Referencia</th>
              <th>Categoría</th>
              <th>Detalle</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody className="text-xs uppercase">
            {materiaPrimaActualizado.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.categoria}</td>
                <td>{item.detalle}</td>
                <td className="font-bold">
                  {formatearDinero(Number(item.precio_und))}
                </td>
                <td className="font-bold text-blue-500">{item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <strong>Subtotal Materia Prima: </strong>
          <span className="text-primary font-bold">
            {formatearDinero(subtotalMateriaPrima)}
          </span>
        </div>

        <h2 className="mt-4 underline font-bold text-blue-500 text-lg">
          Bienes de uso
        </h2>
        <table className="table">
          <thead>
            <tr className="font-bold text-gray-800 text-base">
              <th>Referencia</th>
              <th>Categoría</th>
              <th>Detalle</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody className="text-xs uppercase">
            {bienesDeUsoActualizado.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.categoria}</td>
                <td>{item.detalle}</td>
                <td className="font-bold">
                  {formatearDinero(Number(item.precio_und))}
                </td>
                <td className="font-bold text-blue-500">{item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <strong>Subtotal Bienes de uso: </strong>
          <span className="text-primary font-bold">
            {formatearDinero(subtotalBienesDeUso)}
          </span>
        </div>

        <div className="mt-4 bg-gray-800 py-5 px-5">
          <strong className="text-white">Subtotal Bienes de uso: </strong>
          <span className="bg-blue-50 text-blue-500 py-1 px-2 rounded-md font-bold">
            {formatearDinero(subtotalBienesDeUso + subtotalMateriaPrima)}
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={() =>
              document.getElementById("my_modal_imprimir_vivienda").showModal()
            }
            className="font-bold bg-primary py-2 px-4 rounded-md text-white flex gap-2 items-center"
          >
            Descargar e imprimir pdf <IoCloudDone className="text-xl" />
          </button>
        </div>

        <ImprimirPdfVivienda
          bienesDeUsoActualizado={bienesDeUsoActualizado}
          materiaPrimaActualizado={materiaPrimaActualizado}
          subtotalBienesDeUso={subtotalBienesDeUso}
          subtotalMateriaPrima={subtotalMateriaPrima}
        />
      </div>
    </dialog>
  );
};

const ModalCrearModelo = () => {
  const [productosMateriasPrima, setProductosMateriasPrima] = useState([]);
  const [productosBienesDeUso, setProductosBienesDeUso] = useState([]);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    const datosProducto = {
      ...formData,
      productos_materia_prima: productosMateriasPrima,
      productos_bienes_de_uso: productosBienesDeUso,
    };

    try {
      const res = await client.post("/viviendas", datosProducto);

      console.log("datos enviados", res.data);

      document.getElementById("my_modal_modelo").close();

      showSuccessToast("Modelo cargado correctamente");
    } catch (error) {
      console.error("Error al enviar el producto:", error);
    }
  };

  const addProductosMateriaPrima = (
    id,
    categoria,
    detalle,
    precio_und,
    cantidad,
    usuario
  ) => {
    const DATA = { id, categoria, detalle, precio_und, cantidad, usuario };

    setProductosMateriasPrima([...productosMateriasPrima, DATA]);
  };

  const addProductosBienesDeUso = (
    id,
    categoria,
    detalle,
    precio_und,
    cantidad,
    usuario
  ) => {
    const DATA = { id, categoria, detalle, precio_und, cantidad, usuario };

    setProductosBienesDeUso([...productosBienesDeUso, DATA]);
  };

  // Calcula el total usando reduce
  const totalBienesDeUso = productosBienesDeUso.reduce((acc, item) => {
    // Convierte precio_und y cantidad a números
    const precio = parseFloat(item.precio_und);
    const cantidad = parseInt(item.cantidad, 10);

    // Calcula el total para este item
    const totalItem = precio * cantidad;

    // Suma al acumulador
    return acc + totalItem;
  }, 0); // El valor inicial del acumulador es 0

  const totalMateriasPrima = productosMateriasPrima.reduce((acc, item) => {
    // Convierte precio_und y cantidad a números
    const precio = parseFloat(item.precio_und);
    const cantidad = parseInt(item.cantidad, 10);

    // Calcula el total para este item
    const totalItem = precio * cantidad;

    // Suma al acumulador
    return acc + totalItem;
  }, 0); // El valor inicial del acumulador es 0

  return (
    <dialog id="my_modal_modelo" className="modal">
      <div className="modal-box rounded-md max-w-7xl scroll-bar cursor-pointer">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Crear nuevo modelo de vivienda.</h3>
        <p className="py-0.5">
          En está seccion podras crear un nuevo modelo...
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <article className="grid grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm">Nombre del modelo</label>
              <input
                {...register("nombre_modelo")}
                type="text"
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                placeholder="Escribe el nombre del modelo.."
              />
            </div>
          </article>
          <div className="mt-4">
            <button
              onClick={() =>
                document
                  .getElementById("my_modal_seleccionar_producto_materia_prima")
                  .showModal()
              }
              className="bg-primary py-2 px-4 rounded-md text-white font-semibold text-sm"
              type="button"
            >
              Seleccionar producto materia prima
            </button>
          </div>
          <div className="mt-2 font-bold text-blue-500 mb-2 text-lg">
            <p>Productos materia prima.</p>
          </div>
          <div className="max-md:overflow-x-auto mx-5 max-md:h-[100vh] scrollbar-hidden">
            <table className="table">
              <thead className="text-left font-bold text-gray-900 text-sm">
                <tr className="">
                  <th>Codigo</th>
                  <th>Detalle</th>
                  <th>Categoria</th>
                  <th>Precio Und</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody className="text-xs capitalize font-medium">
                {productosMateriasPrima.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.detalle}</td>
                    <td>{p.categoria}</td>
                    <td>
                      <div className="flex">
                        <p className="font-bold bg-primary py-1 px-4 rounded-md text-white">
                          {formatearDinero(Number(p.precio_und))}
                        </p>
                      </div>
                    </td>
                    <td className="font-bold">{p.cantidad}</td>
                    <td className="font-bold">
                      {formatearDinero(p.cantidad * p.precio_und)}
                    </td>
                    <td className="">
                      <div>
                        <FaDeleteLeft className="text-red-600 text-xl cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              onClick={() =>
                document
                  .getElementById("my_modal_seleccionar_producto_bienes_de_uso")
                  .showModal()
              }
              className="bg-primary py-2 px-4 rounded-md text-white font-semibold text-sm"
              type="button"
            >
              Seleccionar producto bienes de uso
            </button>
          </div>
          <div className="mt-2 font-bold text-blue-500 mb-2 text-lg">
            <p>Productos bienes de uso.</p>
          </div>
          <div className="max-md:overflow-x-auto mx-5 max-md:h-[100vh] scrollbar-hidden">
            <table className="table">
              <thead className="text-left font-bold text-gray-900 text-sm">
                <tr className="">
                  <th>Codigo</th>
                  <th>Detalle</th>
                  <th>Categoria</th>
                  <th>Precio Und</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody className="text-xs capitalize font-medium">
                {productosBienesDeUso.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.detalle}</td>
                    <td>{p.categoria}</td>
                    <td>
                      <div className="flex">
                        <p className="font-bold bg-primary py-1 px-4 rounded-md text-white">
                          {formatearDinero(Number(p.precio_und))}
                        </p>
                      </div>
                    </td>
                    <td className="font-bold">{p.cantidad}</td>
                    <td className="font-bold">
                      {formatearDinero(p.cantidad * p.precio_und)}
                    </td>
                    <td className="">
                      <div>
                        <FaDeleteLeft className="text-red-600 text-xl cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-800 py-5 px-5 rounded-md mt-5">
            <p className="text-white font-medium">
              Subtotal{" "}
              <span className="font-bold">
                {formatearDinero(Number(totalBienesDeUso + totalMateriasPrima))}
              </span>
            </p>
          </div>
          <div className="mt-5">
            <button
              className="bg-blue-500 py-2 px-4 rounded-md text-white font-bold text-sm"
              type="submit"
            >
              Crear modelo de vivienda.
            </button>
          </div>
        </form>

        <ModalSeleccionarProductoMateriaPrima
          addProductosMateriaPrima={addProductosMateriaPrima}
        />
        <ModalSeleccionarProductoBienesDeUso
          addProductosBienesDeUso={addProductosBienesDeUso}
        />
      </div>
    </dialog>
  );
};

const ModalSeleccionarProductoMateriaPrima = ({ addProductosMateriaPrima }) => {
  const { productos, categorias } = useProductosContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <dialog id="my_modal_seleccionar_producto_materia_prima" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Seleccionar productos materia prima y bienes de compra.
        </h3>
        <div className="mt-5 mx-5 flex gap-2 max-md:flex-col">
          <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por nombre.."
            />
            <FaSearch className="text-gray-700" />
          </div>

          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="font-bold text-blue-500 text-xs" value="all">
                Todas las categorías
              </option>
              {categorias.map((c) => (
                <option className="font-semibold uppercase text-xs" key={c.id}>
                  {c?.detalle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-md:overflow-x-auto mx-5 my-10 max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr className="">
                <th>Codigo</th>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio Und</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody className="text-xs capitalize font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="uppercase">{p.detalle}</td>
                  <td className="uppercase">{p.categoria}</td>
                  <td className="">
                    <div className="flex">
                      <p className="bg-gray-800 py-1.5 px-2 rounded-md text-white font-bold">
                        {Number(p.precio_und).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleObtenerId(p.id),
                          document
                            .getElementById("my_modal_producto_seleccionado")
                            .showModal();
                      }}
                      className="font-bold bg-primary text-white py-2 px-4 rounded-md hover:shadow-md transition-all"
                    >
                      Seleccionar el producto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ProductoSeleccionado
          idObtenida={idObtenida}
          addProductosMateriaPrima={addProductosMateriaPrima}
        />
      </div>
    </dialog>
  );
};

const ProductoSeleccionado = ({ idObtenida, addProductosMateriaPrima }) => {
  const [producto, setProducto] = useState([]);
  const { register, setValue, handleSubmit, watch } = useForm();

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get(`/producto/${idObtenida}`);

      setValue("precio", respuesta.data.precio_und);

      setProducto(respuesta.data);
    };
    obtenerDatos();
  }, [idObtenida]);

  const precio = watch("precio");
  const cantidad = watch("cantidad");

  return (
    <dialog id="my_modal_producto_seleccionado" className="modal">
      <div className="modal-box max-w-2xl rounded-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Producto seleccionado,{" "}
          <span className="uppercase font-bold text-primary">
            {producto.detalle}
          </span>
        </h3>
        <div className="mt-2">
          <p className="font-bold text-base underline">
            Datos del producto a cargar
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <p className="border border-gray-300 py-2 px-2 rounded-md text-sm font-bold uppercase">
              Detalle: <span className="text-primary">{producto.detalle}</span>
            </p>
            <p className="border border-gray-300 py-2 px-2 rounded-md text-sm font-bold uppercase">
              Categoria:{" "}
              <span className="text-primary">{producto.categoria}</span>
            </p>
          </div>
        </div>
        <div className="mt-2">
          <div>
            <p className="font-bold text-base underline">
              Costós del producto, cantidad.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Precio del producto</label>
              <input
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                {...register("precio")}
                placeholder="Precio del producto.."
              />
            </div>
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Cantidad</label>
              <input
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                {...register("cantidad")}
                placeholder="Cantidad.."
              />
            </div>
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Subtotal</label>
              <p className="rounded-md border border-gray-300 py-2 px-2 text-sm placeholder:normal-case capitalize outline-none focus:shadow-md font-bold">
                {formatearDinero(Number(precio * cantidad))}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <button
              className="bg-primary py-2 px-4 text-white rounded-md text-sm font-bold"
              onClick={() => {
                addProductosMateriaPrima(
                  producto.id,
                  producto.categoria,
                  producto.detalle,
                  precio,
                  cantidad,
                  producto.usuario
                ),
                  document
                    .getElementById("my_modal_producto_seleccionado")
                    .close(),
                  document
                    .getElementById(
                      "my_modal_seleccionar_producto_materia_prima"
                    )
                    .close();
              }}
              type="button"
            >
              Cargar producto
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

//Bienes de uso..
const ModalSeleccionarProductoBienesDeUso = ({ addProductosBienesDeUso }) => {
  const { productos, categorias } = useProductosContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <dialog id="my_modal_seleccionar_producto_bienes_de_uso" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Seleccionar productos materia prima y bienes de compra.
        </h3>
        <div className="mt-5 mx-5 flex gap-2 max-md:flex-col">
          <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por nombre.."
            />
            <FaSearch className="text-gray-700" />
          </div>

          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="font-bold text-blue-500 text-xs" value="all">
                Todas las categorías
              </option>
              {categorias.map((c) => (
                <option className="font-semibold uppercase text-xs" key={c.id}>
                  {c?.detalle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-md:overflow-x-auto mx-5 my-10 max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr className="">
                <th>Codigo</th>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio Und</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody className="text-xs capitalize font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td className="uppercase">{p.detalle}</td>
                  <td className="uppercase">{p.categoria}</td>
                  <td className="">
                    <div className="flex">
                      <p className="bg-gray-800 py-1.5 px-2 rounded-md text-white font-bold">
                        {Number(p.precio_und).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleObtenerId(p.id),
                          document
                            .getElementById(
                              "my_modal_producto_seleccionado_bienes_de_uso"
                            )
                            .showModal();
                      }}
                      className="font-bold bg-primary text-white py-2 px-4 rounded-md hover:shadow-md transition-all"
                    >
                      Seleccionar el producto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ProductoSeleccionadoBienesDeUso
          idObtenida={idObtenida}
          addProductosBienesDeUso={addProductosBienesDeUso}
        />
      </div>
    </dialog>
  );
};

const ProductoSeleccionadoBienesDeUso = ({
  idObtenida,
  addProductosBienesDeUso,
}) => {
  //Productos..
  const [producto, setProducto] = useState([]);
  const { register, setValue, handleSubmit, watch } = useForm();

  useEffect(() => {
    const obtenerDatos = async () => {
      const respuesta = await client.get(`/producto/${idObtenida}`);

      setValue("precio", respuesta.data.precio_und);

      setProducto(respuesta.data);
    };
    obtenerDatos();
  }, [idObtenida]);

  const precio = watch("precio");
  const cantidad = watch("cantidad");

  return (
    <dialog id="my_modal_producto_seleccionado_bienes_de_uso" className="modal">
      <div className="modal-box max-w-2xl rounded-md">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Producto seleccionado,{" "}
          <span className="uppercase font-bold text-primary">
            {producto.detalle}
          </span>
        </h3>
        <div className="mt-2">
          <p className="font-bold text-base underline">
            Datos del producto a cargar
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <p className="border border-gray-300 py-2 px-2 rounded-md text-sm font-bold uppercase">
              Detalle: <span className="text-primary">{producto.detalle}</span>
            </p>
            <p className="border border-gray-300 py-2 px-2 rounded-md text-sm font-bold uppercase">
              Categoria:{" "}
              <span className="text-primary">{producto.categoria}</span>
            </p>
          </div>
        </div>
        <div className="mt-2">
          <div>
            <p className="font-bold text-base underline">
              Costós del producto, cantidad.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Precio del producto</label>
              <input
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                {...register("precio")}
                placeholder="Precio del producto.."
              />
            </div>
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Cantidad</label>
              <input
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
                {...register("cantidad")}
                placeholder="Cantidad.."
              />
            </div>
            <div className="flex flex-col gap-1">
              {" "}
              <label className="font-bold text-sm">Subtotal</label>
              <p className="rounded-md border border-gray-300 py-2 px-2 text-sm placeholder:normal-case capitalize outline-none focus:shadow-md font-bold">
                {formatearDinero(Number(precio * cantidad))}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <button
              className="bg-primary py-2 px-4 text-white rounded-md text-sm font-bold"
              onClick={() => {
                addProductosBienesDeUso(
                  producto.id,
                  producto.categoria,
                  producto.detalle,
                  precio,
                  cantidad,
                  producto.usuario
                ),
                  document
                    .getElementById(
                      "my_modal_producto_seleccionado_bienes_de_uso"
                    )
                    .close(),
                  document
                    .getElementById(
                      "my_modal_seleccionar_producto_bienes_de_uso"
                    )
                    .close();
              }}
              type="button"
            >
              Cargar producto
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const ImprimirPdfVivienda = ({
  bienesDeUsoActualizado,
  materiaPrimaActualizado,
  subtotalBienesDeUso,
  subtotalMateriaPrima,
}) => {
  return (
    <dialog id="my_modal_imprimir_vivienda" className="modal">
      <div className="modal-box rounded-md max-w-6xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Imprimir el el pdf de la vivienda.
        </h3>
        <PDFViewer className="w-full h-[100vh]">
          <ImprimirPdfViviendasPdf
            bienesDeUsoActualizado={bienesDeUsoActualizado}
            materiaPrimaActualizado={materiaPrimaActualizado}
            subtotalBienesDeUso={subtotalBienesDeUso}
            subtotalMateriaPrima={subtotalMateriaPrima}
          />
        </PDFViewer>
      </div>
    </dialog>
  );
};
