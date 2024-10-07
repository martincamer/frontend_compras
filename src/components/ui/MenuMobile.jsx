import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export const MenuMobile = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1" : "w-0 opacity-1"
      } transition-all ease-linear flex flex-col bg-white h-full z-[1000] fixed top-0 bottom-0 left-0 border-r max-md:fixed md:hidden`}
    >
      {/* Botón de menú */}
      <div
        className={`py-5 px-6 ${
          isOpen ? "flex justify-between items-center" : ""
        }`}
      >
        <button
          className="text-4xl bg-gradient-to-r from-purple-500 to-pink-500 rounded-md px-1"
          onClick={handleToggle}
        >
          {isOpen ? (
            <IoCloseOutline className="text-white" />
          ) : (
            <IoMenuOutline className="text-white" />
          )}
        </button>
        {isOpen && (
          <p className="bg-gradient-to-r from-purple-500 to-pink-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
            {user?.username}
          </p>
        )}
      </div>
      {isOpen && (
        <div className="w-full max-h-full min-h-full h-full flex flex-col gap-0">
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/"}
            className={`${
              location.pathname === "/" ? "bg-primary text-white" : "bg-none"
            }   font-bold text-sm transition-all py-3 px-3`}
          >
            Inicio panel de compras
          </Link>
          {user.tipo === "admin" ? (
            ""
          ) : (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              to={"/productos"}
              className={`${
                location.pathname === "/productos"
                  ? "bg-primary text-white"
                  : "bg-none"
              }   font-bold text-sm transition-all py-3 px-3`}
            >
              Sector de productos
            </Link>
          )}
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/ordenes"}
            className={`${
              location.pathname === "/ordenes"
                ? "bg-primary text-white"
                : "bg-none"
            }   font-bold text-sm transition-all py-3 px-3`}
          >
            Sector ordenes de compra
          </Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/proveedores"}
            className={`${
              location.pathname === "/proveedores"
                ? "bg-primary text-white"
                : "bg-none"
            }   font-bold text-sm transition-all py-3 px-3`}
          >
            Sector de proveedores
          </Link>

          {user.tipo === "admin" && (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              to={"/cuentas"}
              className={`${
                location.pathname === "/cuentas" ? "bg-blue-100" : "bg-none"
              } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
            >
              Crear cuentas/editar/administrar
            </Link>
          )}
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/0 opacity-50 z-[-1]"
          onClick={handleOverlayClick}
        />
      )}
    </div>
  );
};
