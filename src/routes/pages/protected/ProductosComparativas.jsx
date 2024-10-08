import { useEffect, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { useProductosContext } from "../../../context/ProductosProvider";
import { FaEdit, FaSearch } from "react-icons/fa";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { useObtenerId } from "../../../helpers/obtenerId";
import { FaDeleteLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";

import axios from "axios";
import { useForm } from "react-hook-form";
import client from "../../../api/axios";
import { formatearMesAño } from "../../../helpers/formatearFecha";

export const ProductosComparativas = () => {
  const [productosComparativas, setProductosComparativas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(""); // New state for category
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [sortByCategoria, setSortByCategoria] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get("/productos-comparativos");
      setProductosComparativas(res.data);
    };
    loadData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleProveedorChange = (e) => {
    setSelectedProveedor(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value); // Handle category selection
  };

  const handleDesdeChange = (e) => {
    setDesde(e.target.value);
  };

  const handleHastaChange = (e) => {
    setHasta(e.target.value);
  };

  const filteredProducts = productosComparativas
    .flatMap((comparativo) => {
      const productos = JSON.parse(comparativo.productos);
      return productos.map((producto) => ({
        ...producto,
        created_at: comparativo.created_at,
      }));
    })
    .filter((producto) => {
      // Filtro por detalle
      return (
        search === "" ||
        producto.detalle.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((producto) => {
      // Filtro por proveedor
      return (
        selectedProveedor === "" || producto.proveedor === selectedProveedor
      );
    })
    .filter((producto) => {
      // Filtro por categoría
      return (
        selectedCategoria === "" || producto.categoria === selectedCategoria
      );
    })
    .filter((producto) => {
      // Filtro por fecha desde y hasta
      const productoFecha = new Date(producto.created_at);
      const desdeFecha = desde ? new Date(desde) : null;
      const hastaFecha = hasta ? new Date(hasta) : null;

      return (
        (!desde || productoFecha >= desdeFecha) &&
        (!hasta || productoFecha <= hastaFecha)
      );
    })
    .sort((a, b) => {
      // Ordenar por categoría si sortByCategoria es verdadero
      if (sortByCategoria) {
        return a.categoria.localeCompare(b.categoria);
      }
      // Ordenar por fecha de creación de mayor a menor por defecto
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const proveedores = [
    ...new Set(
      productosComparativas.flatMap((comparativo) =>
        JSON.parse(comparativo.productos).map((p) => p.proveedor)
      )
    ),
  ];

  const categorias = [
    ...new Set(
      productosComparativas.flatMap((comparativo) =>
        JSON.parse(comparativo.productos).map((p) => p.categoria)
      )
    ),
  ];

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 mb-10 flex justify-between items-center max-md:flex-col max-md:gap-3 max-md:mb-0">
        <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Sector productos comparativas.
        </p>
        <button
          onClick={() =>
            document.getElementById("my_modal_producto_comparativo").showModal()
          }
          type="button"
          className="bg-gradient-to-r from-primary to-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm max-md:hidden"
        >
          Cargar nuevo producto comparativo
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white px-10 grid grid-cols-4 gap-5 max-md:grid-cols-1 max-md:px-5 max-md:pt-5 max-md:gap-1.5">
        {/* Buscador por detalle */}
        <input
          type="text"
          placeholder="Buscar por detalle"
          className="py-1.5 text-sm px-4 border rounded-md outline-none border-gray-300"
          value={search}
          onChange={handleSearchChange}
        />

        {/* Select de Proveedor */}
        <select
          className="py-1.5 text-sm px-4 border rounded-md outline-none border-gray-300 uppercase font-semibold"
          value={selectedProveedor}
          onChange={handleProveedorChange}
        >
          <option className="font-bold" value="">
            Seleccionar proveedor
          </option>
          {proveedores.map((proveedor, idx) => (
            <option
              className="uppercase font-semibold"
              key={idx}
              value={proveedor}
            >
              {proveedor}
            </option>
          ))}
        </select>

        <select
          value={selectedCategoria}
          onChange={handleCategoriaChange} // Category change handler
          className="py-1.5 text-sm px-4 border rounded-md outline-none border-gray-300 uppercase font-semibold"
        >
          <option className="font-bold" value="">
            Seleccionar categoría
          </option>
          {categorias.map((categoria, index) => (
            <option
              className="uppercase font-semibold"
              key={index}
              value={categoria}
            >
              {categoria}
            </option>
          ))}
        </select>

        <div className="flex gap-2 max-md:w-full">
          {/* Filtro por rango de fechas */}
          <input
            type="date"
            className="py-1.5 text-sm px-4 border rounded-md outline-none border-gray-300 max-md:w-full font-semibold"
            value={desde}
            onChange={handleDesdeChange}
          />
          <input
            type="date"
            className="py-1.5 text-sm px-4 border rounded-md outline-none border-gray-300 max-md:w-full font-semibold"
            value={hasta}
            onChange={handleHastaChange}
          />
        </div>

        {/* Ordenar por categoría */}
      </div>
      <div className="px-10 pt-3 max-md:px-5 max-md:w-full">
        <button
          onClick={() => setSortByCategoria(!sortByCategoria)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 py-2 px-4 rounded-md text-white font-semibold text-sm max-md:w-full"
        >
          {sortByCategoria
            ? "Quitar Orden por Categoría"
            : "Ordenar por Categoría"}
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white py-5 px-10">
        <div className="max-md:overflow-x-auto max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr>
                <th>Referencia</th>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Proveedor</th>
                <th>Precio</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody className="text-xs uppercase font-medium">
              {filteredProducts.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.id}</td>
                  <td>{producto.detalle}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.proveedor}</td>
                  <td>
                    <div className="flex">
                      <p className="bg-gradient-to-r from-blue-500 to-green-500 py-1 px-2 rounded-md text-white font-bold">
                        {formatearDinero(Number(producto.precio_und))}
                      </p>
                    </div>
                  </td>
                  <td>{formatearMesAño(producto.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalProductoComparativo
        setProductosComparativos={setProductosComparativas}
      />
    </section>
  );
};

export const ModalProductoComparativo = ({ setProductosComparativos }) => {
  const { register, handleSubmit } = useForm();
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const onSubmit = handleSubmit(async (formData) => {
    const dataEnviada = { ...formData, productos: productoSeleccionado };
    const res = await client.post("/crear-producto-comparativo", dataEnviada);

    console.log(res.data);

    showSuccessToast("Creado correctamente");

    setProductosComparativos(res.data);

    document.getElementById("my_modal_producto_comparativo").close();
  });

  const addToProductos = (id, detalle, categoria, precio_und, proveedor) => {
    const newProducto = {
      id,
      detalle,
      categoria,
      precio_und,
      proveedor,
    };

    const productoSeleccionadoItem = productoSeleccionado.find((item) => {
      return item.id === id;
    });

    document.getElementById("my_modal_producto_seleccionado").close();
    document.getElementById("my_modal_producto_compra").close();

    if (productoSeleccionadoItem) {
      setTimeout(() => {}, 2000);
      console.log("error");
    } else {
      setProductoSeleccionado([...productoSeleccionado, newProducto]);
    }
  };

  const deleteProducto = (id) => {
    const itemIndex = productoSeleccionado.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const newItem = [...productoSeleccionado];
      newItem.splice(itemIndex, 1); // Corrected line
      setProductoSeleccionado(newItem);
    }
  };

  console.log("pp", productoSeleccionado);

  return (
    <dialog id="my_modal_producto_comparativo" className="modal">
      <div className="modal-box rounded-md max-w-4xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 py-5">
          <div className="flex flex-col gap-2 items-start">
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_producto_compra").showModal()
              }
              className="py-1.5 px-6 bg-gradient-to-r from-blue-500 to-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Seleccionar el producto comparativo
            </button>

            <div className="max-md:overflow-x-auto scrollbar-hidden w-full">
              <table className="table">
                <thead className="font-bold text-gray-900 text-sm">
                  <tr>
                    <th>Detalle</th>
                    <th>Categoria</th>
                    <th>Precio Und</th>
                    <th>Proveedor</th>
                  </tr>
                </thead>
                <tbody className="text-xs uppercase font-medium">
                  {productoSeleccionado.map((p) => (
                    <tr key={p.id}>
                      <td>{p.detalle}</td>
                      <td>{p.categoria}</td>
                      <td className="font-bold">
                        {formatearDinero(Number(p.precio_und))}
                      </td>
                      <td>{p.proveedor}</td>
                      <td>
                        <FaDeleteLeft
                          onClick={() => deleteProducto(p.id)}
                          className="text-xl text-red-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Guardar los productos
            </button>
          </div>
        </form>

        <ModalCargarProductoCompra addToProductos={addToProductos} />
      </div>
    </dialog>
  );
};

export const ModalCargarProductoCompra = ({ addToProductos }) => {
  const { productos, categorias } = useProductosContext();

  const { handleObtenerId, idObtenida } = useObtenerId();

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

  return (
    <dialog id="my_modal_producto_compra" className="modal">
      <div className="modal-box rounded-md max-w-7xl scroll-bar h-[60vh] max-md:w-full max-md:max-h-full max-md:h-full max-md:rounded-none max-md:py-14">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="flex gap-2 max-md:flex-col max-md:gap-0">
          <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/3 max-md:w-full mb-3">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por nombre del producto.."
            />
            <FaSearch className="text-gray-700" />
          </div>

          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="font-bold text-blue-500" value="all">
                Todas las categorías
              </option>
              {categorias.map((c) => (
                <option className="font-semibold capitalize" key={c.id}>
                  {c?.detalle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-md:overflow-x-auto scrollbar-hidden">
          <table className="table">
            <thead className="text-gray-800 text-sm">
              <tr>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio und $</th>
              </tr>
            </thead>

            <tbody className="text-xs uppercase font-medium">
              {filteredProducts.map((p) => (
                <tr key={p?.id}>
                  <td>{p?.detalle}</td>
                  <td>{p?.categoria}</td>
                  <th>{formatearDinero(Number(p.precio_und))}</th>
                  <td className="md:hidden">
                    <FaEdit
                      className="text-primary text-xl"
                      onClick={() => {
                        handleObtenerId(p?.id),
                          document
                            .getElementById("my_modal_producto_seleccionado")
                            .showModal();
                      }}
                    />
                  </td>
                  <td className="max-md:hidden">
                    <button
                      onClick={() => {
                        handleObtenerId(p?.id),
                          document
                            .getElementById("my_modal_producto_seleccionado")
                            .showModal();
                      }}
                      type="button"
                      className="py-1.5 px-6 bg-gradient-to-r from-blue-500 to-pink-600 hover:shadow-md text-white transition-all rounded-md font-medium text-xs"
                    >
                      Seleccionar producto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalProductoSeleccionado
          addToProductos={addToProductos}
          idObtenida={idObtenida}
        />
      </div>
    </dialog>
  );
};

export const ModalProductoSeleccionado = ({ addToProductos, idObtenida }) => {
  const { productos, setProductos } = useProductosContext();
  const { proveedores } = useProductosContext();

  const [producto, setProducto] = useState([]);
  const [precio_und, setPrecio] = useState(0);
  const [proveedor, setProveedor] = useState("");
  useEffect(() => {
    async function laodData() {
      const res = await client.get(`/producto/${idObtenida}`);

      setProducto(res.data);
      setPrecio(res.data.precio_und);
    }

    laodData();
  }, [idObtenida]);

  // Función para generar un ID numérico aleatorio
  function generarID() {
    return Math.floor(Math.random() * 1000000).toString(); // Genera un número aleatorio de hasta 6 dígitos
  }

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_producto_seleccionado" className="modal">
      <div className="modal-box rounded-md max-w-6xl max-md:w-full max-md:h-full max-md:rounded-none max-md:max-h-full max-md:pt-12">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="max-md:overflow-x-auto scrollbar-hidden">
          <table className="table">
            <thead className="font-bold text-gray-800 text-sm">
              <tr>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio por und $</th>
                <th>Proveedor</th>
              </tr>
            </thead>

            <tbody className="uppercase text-xs font-medium">
              <tr key={producto.id}>
                <td>{producto?.detalle}</td>
                <td>{producto?.categoria}</td>
                <td className="cursor-pointer" onClick={handleInputClick}>
                  {isEditable ? (
                    <input
                      value={precio_und}
                      onChange={(e) => setPrecio(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    />
                  ) : (
                    <p className="py-2 px-2 border border-gray-300 rounded-md outline-none font-bold">
                      {formatearDinero(Number(precio_und))}
                    </p>
                  )}
                </td>
                <td>
                  <div>
                    <select
                      value={proveedor}
                      onChange={(e) => setProveedor(e.target.value)}
                      className="border border-gray-300 rounded-md py-2 px-2 font-bold text-xs outline-none uppercase"
                    >
                      <option className="font-bold text-primary" value="">
                        Seleccionar proveedor
                      </option>
                      {proveedores.map((p) => (
                        <option
                          key={p.id}
                          value={p.proveedor}
                          className="font-semibold uppercase"
                        >
                          {p.proveedor}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              const randomID = generarID();
              addToProductos(
                parseInt(`${producto?.id}${randomID}`, 10), // Combina el ID del producto con el ID aleatorio
                producto?.detalle,
                producto?.categoria,
                precio_und,
                proveedor
              );
            }}
            type="button"
            className="py-1.5 px-6 bg-gradient-to-r from-yellow-500 to-pink-600 hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
          >
            Agregar el producto
          </button>
        </div>
      </div>
    </dialog>
  );
};
