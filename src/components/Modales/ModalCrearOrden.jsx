import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { ModalSeleccionarProducto } from "./ModalSeleccionarProducto";
import { ModalEditarProductoSeleccionado } from "./ModalEditarProductoSeleccionado";
import { useProductosContext } from "../../context/ProductosProvider";
import { ModalCrearProductos } from "./ModalCrearProductos";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearOrden = ({ isOpen, closeModal }) => {
  const { setOrdenesMensuales } = useOrdenesContext();

  const { proveedores, setProveedores } = useProductosContext();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/proveedores");
      setProveedores(respuesta.data);
    }

    loadData();
  }, []);

  const [isOpenProductoNew, setIsOpenProductoNew] = useState(false);

  const openModalProducto = () => {
    setIsOpenProductoNew(true);
  };

  const closeModalProducto = () => {
    setIsOpenProductoNew(false);
  };

  const [proveedor, setProveedor] = useState("");
  const [numero_factura, setNumeroFactura] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fecha_factura, setFechaFactura] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [socket, setSocket] = useState(null);
  const [iva, setIva] = useState(1.21);

  const [OBTENERID, setObtenerId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const handleID = (id) => setObtenerId(id);

  const addToProductos = (
    id,
    detalle,
    categoria,
    precio_und,
    cantidad,
    totalFinal,
    totalFinalIva,
    iva,
    cantidadFaltante
  ) => {
    const newProducto = {
      id,
      detalle,
      categoria,
      precio_und,
      cantidad,
      totalFinal,
      totalFinalIva,
      iva,
      cantidadFaltante: 0,
    };

    const productoSeleccionadoItem = productoSeleccionado.find((item) => {
      return item.id === id;
    });

    if (productoSeleccionadoItem) {
      setTimeout(() => {
        // setErrorProducto(false);
      }, 2000);
      setErrorProducto(true);
    } else {
      setProductoSeleccionado([...productoSeleccionado, newProducto]);
      // setErrorProducto(false);
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

  // useEffect(() => {
  //   const newSocket = io("https://backendcompras-production.up.railway.app", {
  //     withCredentials: true,
  //   });

  //   setSocket(newSocket);

  //   // newSocket.on("crear-orden", (nuevaSalida) => {
  //   //   setOrdenesMensuales((prevTipos) => [...prevTipos, nuevaSalida]);
  //   // });

  //   // newSocket.on("crear-orden-dos", (nuevaSalida) => {
  //   //   setOrdenes((prevTipos) => [...prevTipos, nuevaSalida]);
  //   // });

  //   return () => newSocket.close();
  // }, []);

  const totalesFinales = productoSeleccionado.reduce((total, producto) => {
    return total + Number(producto?.totalFinal);
  }, 0);

  const totalFinalSumSinIva = productoSeleccionado.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.totalFinalIva;
    },
    0
  );

  console.log(proveedores);

  console.log(totalFinalSumSinIva);

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosOrden = {
      proveedor,
      numero_factura,
      precio_final: Number(totalFinalSumSinIva),
      fecha_factura,
      localidad,
      provincia,
      detalle,
      datos: { productoSeleccionado },
      iva,
    };

    const datos = {
      proveedor,
      total: Number(totalFinalSumSinIva),
    };

    const res = await client.post("/crear-orden-nueva", datosOrden);
    // const resDos = await client.post("/crear-orden-nueva-dos", datosOrden);
    const resProveedor = await client.put(
      `/actualizar-proveedor-compra`,
      datos
    );

    setOrdenesMensuales((prevTipos) => [...prevTipos, res.data]);

    console.log(res.data.precio_final);

    const tipoExistenteIndex = proveedores.findIndex(
      (p) => p.proveedor === proveedor
    );

    setProveedores((prevTipos) => {
      const newTipos = [...prevTipos];
      const updateRemuneracion = JSON.parse(resProveedor.config.data); // Convierte el JSON a objeto

      newTipos[tipoExistenteIndex] = {
        id: newTipos[tipoExistenteIndex].id,
        proveedor: updateRemuneracion.proveedor,
        total:
          Number(newTipos[tipoExistenteIndex].total) +
          Number(totalFinalSumSinIva),
        comprobantes: newTipos[tipoExistenteIndex].comprobantes,
        created_at: newTipos[tipoExistenteIndex].created_at,
        updated_at: newTipos[tipoExistenteIndex].updated_at,
      };

      return newTipos;
    });

    toast.success("¡Orden de compra creada correctamente!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        padding: "10px",
        background: "#b8ffb8",
        color: "#009900",
        borderRadius: "15px",
        boxShadow: "none",
      },
    });

    setTimeout(() => {
      closeModal();
    }, 500);
  };

  const [isOpenProducto, setIsOpenProducto] = useState(false);

  const openProducto = () => {
    setIsOpenProducto(true);
  };

  const closeProducto = () => {
    setIsOpenProducto(false);
  };

  const [isOpenProductoEditar, setIsOpenProductoEditar] = useState(false);

  const openProductoEditar = () => {
    setIsOpenProductoEditar(true);
  };

  const closeProductoEditar = () => {
    setIsOpenProductoEditar(false);
  };

  const handleProveedorChange = (e) => {
    const selectedProveedor = e.target.value;
    setProveedor(selectedProveedor);

    // Buscar la localidad correspondiente al proveedor seleccionado
    const selectedProveedorData = proveedores.find(
      (p) => p.proveedor === selectedProveedor
    );
    if (selectedProveedorData) {
      setLocalidad(selectedProveedorData.localidad);
      setProvincia(selectedProveedorData.provincia);
    } else {
      setLocalidad("");
      setProvincia("");
    }
  };

  return (
    <Menu as="div" className="z-50 bg-white h-full">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[103] overflow-y-auto h-full scroll-bar bg-white"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-10" />
          </Transition.Child>

          <div className="min-h-full h-full w-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-white" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle "
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white h-full w-full z-[105] py-5 px-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-2 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-full hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase font-bold">
                  ORDEN DE COMPRA NUEVA
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        Proveedor de la orden
                      </label>
                      <select
                        value={proveedor}
                        onChange={handleProveedorChange}
                        className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                        placeholder="PROVEEDOR DE LA ORDEN"
                      >
                        <option value={"seleccionar"} className="uppercase">
                          seleccionar el proveedor
                        </option>
                        {proveedores.map((p, index) => (
                          <option
                            className="uppercase"
                            key={index}
                            value={p.proveedor}
                          >
                            {p.proveedor}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        LOCALIDAD
                      </label>
                      <input
                        value={localidad}
                        onChange={(e) => setLocalidad(e.target.value)}
                        type="text"
                        className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                        placeholder="LOCALIDAD"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        PROVINCIA
                      </label>
                      <input
                        value={provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                        type="text"
                        className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                        placeholder="NUMERO DE LA FACT O REM"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        Numero del remito
                      </label>
                      <input
                        value={numero_factura}
                        onChange={(e) => setNumeroFactura(e.target.value)}
                        type="text"
                        className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                        placeholder="NUMERO DE LA FACT O REM"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-slate-700 uppercase">
                        FECHA DEL REMITO/FACT
                      </label>
                      <input
                        value={fecha_factura}
                        onChange={(e) => setFechaFactura(e.target.value)}
                        type="date"
                        className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-1/6">
                    <label className="text-sm text-slate-700 uppercase">
                      Detallar algo mensaje,etc.
                    </label>
                    <textarea
                      value={detalle}
                      onChange={(e) => setDetalle(e.target.value)}
                      type="text"
                      placeholder="ESCRIBIR UN MENSAJE O DETALLAR ALGO."
                      className="py-2.5 px-4 rounded-xl uppercase placeholder:text-slate-400 text-slate-700 font-semibold text-sm bg-gray-200/80"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openProducto()}
                      className="bg-green-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm"
                    >
                      CARGAR PRODUCTO
                    </button>
                    <button
                      type="button"
                      onClick={() => openModalProducto()}
                      className="bg-sky-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm flex gap-2 items-center"
                    >
                      CREAR PRODUCTO INEXISTENTE
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="border-[1px] border-slate-300 rounded-2xl hover:shadow-md transition-all ease-linear">
                    <table className="min-w-full divide-y-2 divide-gray-200 text-sm cursor-pointer">
                      <thead className="text-left">
                        <tr>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Detalle
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Categoria
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Precio Und
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Total
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Iva Seleccionado
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Total final iva
                          </th>
                          <th className="whitespace-nowrap px-4 py-4 text-slate-700 uppercase font-bold">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {productoSeleccionado.map((p) => (
                          <tr key={p.id}>
                            <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                              {p.detalle}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm">
                              {p.categoria}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  uppercase text-sm ">
                              {Number(p.precio_und).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-slate-700">
                              {Number(p.totalFinal).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-normal">
                              {(p.iva === 1.105 && "IVA DEL 10.05") ||
                                (p.iva === 1.21 && "IVA DEL 21.00") ||
                                (p.iva === 0 && "NO TIENE IVA")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4  uppercase text-sm font-bold text-indigo-500">
                              {Number(p.totalFinalIva).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-sm cursor-pointer space-x-2 flex">
                              <div className="dropdown dropdown-left z-1">
                                <div
                                  tabIndex={0}
                                  role="button"
                                  className="hover:bg-slate-100 rounded-full px-2 py-2 transition-all"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-7 h-7"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                    />
                                  </svg>
                                </div>
                                <ul
                                  tabIndex={0}
                                  className="dropdown-content z-[1] menu p-2 shadow-lg border bg-base-100 rounded-box w-52 gap-2"
                                >
                                  <li>
                                    <span
                                      onClick={() => {
                                        handleID(p.id), openProductoEditar();
                                      }}
                                      className="bg-green-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm flex justify-between hover:bg-green-500"
                                    >
                                      EDITAR
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                      </svg>
                                    </span>
                                  </li>
                                  <li>
                                    <span
                                      onClick={() => deleteProducto(p.id)}
                                      className="bg-red-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm flex justify-between hover:bg-red-500"
                                    >
                                      ELIMINAR
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                      </svg>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className=" font-normal py-2 px-5 uppercase text-sm rounded-xl text-sky-700 flex gap-2 items-center">
                      <span className="underline"> subtotal </span>
                      <span className="bg-sky-100 py-2 px-4 text-base rounded-xl font-bold">
                        {totalesFinales.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </p>
                    <p className=" font-normal py-2 px-5 uppercase text-sm rounded-xl text-sky-700 flex gap-2 items-center">
                      <span className="underline"> total iva agregado </span>
                      <span className="bg-sky-100 py-2 px-4 text-base rounded-xl font-bold">
                        {Number(
                          totalFinalSumSinIva - totalesFinales
                        ).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </p>
                    <p className=" font-normal py-2 px-5 uppercase text-sm rounded-xl text-green-700 flex gap-2 items-center">
                      <span className="underline">
                        {" "}
                        total final con <span className="font-bold">
                          ivas
                        </span>{" "}
                        seleccionado{" "}
                      </span>{" "}
                      <span className="bg-green-100 py-2 px-4 text-base rounded-xl font-bold">
                        {Number(totalFinalSumSinIva).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="pb-4">
                    <button
                      type="submit"
                      class="group relative bg-sky-400 hover:bg-sky-500/90s text-white transition-all ease-in-out font-normal uppercase text-sm py-3 px-6 rounded-full flex items-center justify-center gap-2"
                    >
                      CREAR ORDEN NUEVA
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
                <ModalSeleccionarProducto
                  deleteProducto={deleteProducto}
                  addToProductos={addToProductos}
                  OBTENERID={OBTENERID}
                  handleID={handleID}
                  isOpen={isOpenProducto}
                  closeModal={closeProducto}
                />
                <ModalEditarProductoSeleccionado
                  productoSeleccionado={productoSeleccionado}
                  setProductoSeleccionado={setProductoSeleccionado}
                  isOpen={isOpenProductoEditar}
                  closeModal={closeProductoEditar}
                  OBTENERID={OBTENERID}
                />
                <ModalCrearProductos
                  isOpen={isOpenProductoNew}
                  closeModal={closeModalProducto}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
