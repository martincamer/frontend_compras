import { Dialog, Menu, Transition } from "@headlessui/react";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarEntrega = ({
  isOpen,
  closeModal,
  OBTENERID,
  orden,
  setOrden,
}) => {
  const [socket, setSocket] = useState(null);

  const { ordenesMensuales, setOrdenesMensuales } = useOrdenesContext();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/orden-unico/${OBTENERID}`);

      // setDatos(res.data.producto);
      setValue("cantidadFaltante", res.data.producto.cantidadFaltante);
      setValue("cantidad", res?.data?.producto?.cantidad);
      setValue("detalle", res?.data?.producto?.detalle);
      setValue("categoria", res?.data?.producto?.categoria);
      setValue("id", res?.data?.producto?.id);
    }

    loadData();
  }, [OBTENERID]);

  console.log("data", ordenesMensuales);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  console.log(orden);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/editar-producto-orden/${OBTENERID}`, data);

    // Parseamos los datos actualizados del producto
    const updatedData = JSON.parse(res.config.data);

    // Verificamos si la cantidadFaltante es mayor que la cantidad
    if (
      parseInt(updatedData.cantidadFaltante) > parseInt(updatedData.cantidad)
    ) {
      // Si la cantidadFaltante es mayor que la cantidad, mostramos un mensaje de error y salimos de la función

      toast.error("¡Selecciona una cantidad menor que no pase la cantidad!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          padding: "10px",
          background: "#ffd1d1",
          color: "#de0202",
        },
      });
      return;
    }

    // Actualizamos el estado de la orden
    setOrden((prevOrden) => {
      return {
        ...prevOrden,
        datos: {
          ...prevOrden.datos,
          productoSeleccionado: prevOrden.datos.productoSeleccionado.map(
            (producto) => {
              if (producto.id === updatedData.id) {
                return {
                  ...producto,
                  detalle: updatedData.detalle,
                  categoria: updatedData.categoria,
                  cantidad: updatedData.cantidad,
                  cantidadFaltante: updatedData.cantidadFaltante,
                };
              }
              return producto;
            }
          ),
        },
      };
    });

    // Actualizamos el estado de las órdenes mensuales
    setOrdenesMensuales((prevOrdenes) => {
      return prevOrdenes.map((orden) => {
        if (orden.datos && orden.datos.productoSeleccionado) {
          return {
            ...orden,
            datos: {
              ...orden.datos,
              productoSeleccionado: orden.datos.productoSeleccionado.map(
                (producto) => {
                  if (producto.id === updatedData.id) {
                    return {
                      ...producto,
                      detalle: updatedData.detalle,
                      categoria: updatedData.categoria,
                      cantidad: updatedData.cantidad,
                      cantidadFaltante: updatedData.cantidadFaltante,
                    };
                  }
                  return producto;
                }
              ),
            },
          };
        }
        return orden;
      });
    });

    toast.success("¡Estado finalizado completaste la entrega!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        padding: "10px",
        background: "#b8ffb8",
        color: "#009900",
      },
    });
    setTimeout(() => {
      closeModal();
    }, 1500);
  });

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   // const datosProducto = { cantidadFaltante };

  //   const res = await client.put(
  //     `/editar-producto-orden/${OBTENERID}`,
  //     datosProducto
  //   );

  //   console.log(res.config.data);

  //   const tipoExistenteIndexTwo =
  //     ordenesMensuales?.datos?.productoSeleccionado?.findIndex(
  //       (tipo) => tipo.id === OBTENERID
  //     );

  //   setOrdenesMensuales((prevTipos) => {
  //     const newTipos = [...prevTipos];
  //     const updatedTipo = JSON.parse(res.config.data); // Convierte el JSON a objeto

  //     newTipos[tipoExistenteIndexTwo] = {
  //       id: OBTENERID,
  //       cantidadFaltante: updatedTipo.cantidadFaltante,
  //     };

  //     console.log("Estado después de la actualización:", newTipos);
  //     return newTipos;
  //   });

  //   // socket.emit("editar-producto", res);

  //   toast.success("¡Cantidad editada correctamente!", {
  //     position: "top-center",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     theme: "light",
  //     style: {
  //       padding: "10px",
  //       background: "#b8ffb8",
  //       color: "#009900",
  //     },
  //   });

  //   setTimeout(() => {
  //     closeModal();

  //     // location.reload();
  //   }, 500);
  // };

  //   useEffect(() => {
  //     const newSocket = io(
  //       //"https://tecnohouseindustrialbackend-production.up.railway.app",
  //       "http://localhost:4000",
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     setSocket(newSocket);

  //     const handleEditarSalida = (editarSalida) => {
  //       const updateSalida = JSON.parse(editarSalida?.config?.data);

  //       setProductos((prevSalidas) => {
  //         const nuevosSalidas = [...prevSalidas];
  //         const index = nuevosSalidas.findIndex(
  //           (salida) => salida.id === salida.id
  //         );
  //         if (index !== -1) {
  //           nuevosSalidas[index] = {
  //             id: nuevosSalidas[index].id,
  //             detalle: updateSalida.detalle,
  //             precio_und: updateSalida.precio_und,
  //             categoria: updateSalida.categoria,
  //             usuario: nuevosSalidas[index].usuario,
  //             role_id: nuevosSalidas[index].role_id,
  //             created_at: nuevosSalidas[index].created_at,
  //             updated_at: nuevosSalidas[index].updated_at,
  //           };
  //         }
  //         return nuevosSalidas;
  //       });
  //     };

  //     newSocket.on("editar-producto", handleEditarSalida);

  //     return () => {
  //       newSocket.off("editar-producto", handleEditarSalida);
  //       newSocket.close();
  //     };
  //   }, []);

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
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
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] uppercase">
                  Editar el producto
                </div>

                <form onSubmit={onSubmit} className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Total Entrega
                    </label>
                    <input
                      {...register("cantidadFaltante", { required: true })}
                      // value={cantidadFaltante}
                      // onChange={(e) => setEntrega(e.target.value)}
                      type="text"
                      className="border-slate-300 border-[1px] shadow rounded-xl w-full uppercase py-2 px-4"
                      placeholder="PONER EL TOTAL"
                    />
                  </div>

                  <div className="mt-3">
                    <button
                      className="bg-black py-2 px-4 rounded-xl shadow text-white uppercase text-sm"
                      type="submit"
                    >
                      Editar la entrega
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
