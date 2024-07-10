import { Fragment, useState } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { useProductosContext } from "../../context/ProductosProvider";
import { toast } from "react-toastify";
import client from "../../api/axios"; // Asegúrate de importar tu cliente Axios configurado para tu API

export const ModalEditarSaldoProveedor = ({
  isOpen,
  closeModal,
  setDatos,
  params,
}) => {
  const { setProveedores } = useProductosContext();

  const [total, setTotal] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await client.put(`/proveedores/${params.id}/total`, {
      total,
    });

    setDatos(res.data.proveedor);
    setProveedores(res.data.proveedores);

    toast.success("¡Saldo del proveedor editado correctamente!", {
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

    closeModal();
  };

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
            <div className="fixed inset-0 bg-black bg-opacity-10" />
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
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-none ">
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
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                  EDITAR EL SALDO DEL PROVEEDOR
                </div>

                <form onSubmit={onSubmit} className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className="uppercase text-slate-700 text-sm"
                      htmlFor=""
                    >
                      Total del saldo nuevo del proveedor
                    </label>
                    <input
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      type="text"
                      className="border-blue-500 rounded border py-2 px-3 font-semibold text-sm outline-none"
                      placeholder="PONER EL TOTAL"
                    />
                    <div className="flex">
                      <p className="bg-orange-100 py-2 px-5 rounded text-orange-600 font-bold">
                        {Number(total).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}{" "}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      className="bg-blue-500 py-2.5 px-6 rounded-full font-semibold text-white text-sm flex gap-2 items-center hover:bg-orange-500 transition-all"
                      type="submit"
                    >
                      Actualizar el saldo del proveedor
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
