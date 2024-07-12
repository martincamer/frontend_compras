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
      } transition-all ease-linear flex flex-col bg-white min-h-[220vh] max-h-full h-full z-[100] border-r max-md:fixed md:hidden`}
    >
      {/* Botón de menú */}
      <div className={`py-4 px-4 ${isOpen ? "flex justify-between " : ""}`}>
        <button className="text-3xl text-blue-500" onClick={handleToggle}>
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        {isOpen && (
          <p className="bg-blue-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
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
              location.pathname === "/" ? "bg-blue-100" : "bg-none"
            } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Inicio/estadistica/compras
          </Link>
          {user.tipo === "admin" ? (
            ""
          ) : (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              to={"/productos"}
              className={`${
                location.pathname === "/productos" ? "bg-blue-100" : "bg-none"
              } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
            >
              Crear productos/ver/etc
            </Link>
          )}
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/ordenes"}
            className={`${
              location.pathname === "/ordenes" ? "bg-blue-100" : "bg-none"
            } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear ordenes/ver/editar
          </Link>
          {/* <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/ordenes-checkout"}
            className={`${
              location.pathname === "/ordenes-checkout"
                ? "bg-blue-100"
                : "bg-none"
            } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Ver ordenes finalizadas/ver/editar
          </Link> */}
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/proveedores"}
            className={`${
              location.pathname === "/proveedores" ? "bg-blue-100" : "bg-none"
            } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear proveedores/ver saldos/editar
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
