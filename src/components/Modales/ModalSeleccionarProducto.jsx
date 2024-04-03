import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useProductosContext } from "../../context/ProductosProvider";
import { ModalElegirCantidadDelProducto } from "./ModalElegirCantidadDelProducto";

export const ModalSeleccionarProducto = ({
  isOpen,
  closeModal,
  addToProductos,
  OBTENERID,
  handleID,
  deleteProducto,
}) => {
  const { productos } = useProductosContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  // Filtrar productos por término de búsqueda y categoría seleccionada
  const filteredProducts = productos?.filter((product) => {
    return (
      product?.detalle?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
      (selectedCategory === "all" || product?.categoria === selectedCategory)
    );
  });

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [isModalProductoSeleccionado, setOpenModalProductoSeleccionado] =
    useState(false);

  const openModalProductoSeleccionado = () => {
    setOpenModalProductoSeleccionado(true);
  };

  const closeModalProductoSeleccionado = () => {
    setOpenModalProductoSeleccionado(false);
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
              <div className="inline-block w-2/3 max-md:w-full p-6 my-8 overflow-hidden max-md:h-[300px] max-md:overflow-y-scroll text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase">
                  SELECCIONAR PRODUCTO/COMPRA
                </div>

                <div className=" flex bg-white border-slate-300 border-[1px] py-2 px-4 rounded-xl shadow w-1/3 mb-2">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="buscar por el detalle o codigo"
                    className="w-full outline-none uppercase"
                    type="text"
                  />
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
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
                  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          DETALLE
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          CATEGORIA
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          PRECIO POR UND $
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 uppercase font-bold text-sm text-gray-900">
                          SELECCIONAR
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {currentProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                            {p.detalle}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                            {p.categoria}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                            {Number(p.precio_und).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 uppercase">
                            <button
                              onClick={() => {
                                handleID(p.id), openModalProductoSeleccionado();
                              }}
                              type="button"
                              className="bg-green-500 py-2 px-4 rounded-xl shadow uppercase text-white"
                            >
                              Seleccionar producto
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center mt-4">
                  {filteredProducts.length > productsPerPage && (
                    <nav className="pagination">
                      <ul className="pagination-list flex gap-2">
                        {Array.from({
                          length: Math.ceil(
                            filteredProducts.length / productsPerPage
                          ),
                        }).map(
                          (_, index) =>
                            index >= currentPage - 2 &&
                            index <= currentPage + 2 && ( // Mostrar solo 5 páginas a la vez
                              <li key={index} className="pagination-item">
                                <button
                                  onClick={() => paginate(index + 1)}
                                  className={`pagination-link ${
                                    currentPage === index + 1
                                      ? "text-white bg-green-500 px-3 py-1 rounded-xl"
                                      : "text-slate-600 bg-white border-[1px] border-slate-300 px-2 py-1 rounded-xl"
                                  }`}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                        )}
                      </ul>
                    </nav>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-xl hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>

                <ModalElegirCantidadDelProducto
                  addToProductos={addToProductos}
                  OBTENERID={OBTENERID}
                  isOpen={isModalProductoSeleccionado}
                  closeModal={closeModalProductoSeleccionado}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
