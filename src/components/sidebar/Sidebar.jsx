import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import {
  FaBook,
  FaCashRegister,
  FaDatabase,
  FaFileAlt,
  FaTable,
  FaUser,
} from "react-icons/fa";

export const SideBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1" : "w-16 opacity-1"
      } transition-all ease-linear flex flex-col bg-white  z-[100] border-r max-md:hidden`}
    >
      {/* Botón de menú */}
      <div
        className={`${
          isOpen ? "flex justify-between" : ""
        } transition-all ease-linear duration-300 py-3 px-4 border-b-[2px] border-slate-300`}
      >
        <button className="text-3xl text-blue-500" onClick={handleToggle}>
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        {isOpen && (
          <p className="bg-blue-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
            {user?.username}
          </p>
        )}
      </div>
      {isOpen ? (
        <div className="w-full max-h-full min-h-full h-full flex flex-col gap-0">
          <Link
            to={"/"}
            className={`${
              location.pathname === "/" ? "bg-blue-100" : "bg-none"
            } hover:text-blue-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Inicio/estadistica/compras
          </Link>
          {/* {user.tipo === "admin" ? (
            ""
          ) : (
            <Link
              to={"/productos"}
              className={`${
                location.pathname === "/productos" ? "bg-sky-100" : "bg-none"
              } hover:text-sky-700 text-slate-700 text-sm transition-all py-3 px-3`}
            >
              Productos/crear/editar
            </Link>
          )}
          <Link
            to={"/ordenes"}
            className={`${
              location.pathname === "/ordenes" ? "bg-sky-100" : "bg-none"
            } hover:text-sky-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Cargar ordenes/editar/etc
          </Link>

          <Link
            to={"/proveedores"}
            className={`${
              location.pathname === "/proveedores" ? "bg-sky-100" : "bg-none"
            } hover:text-sky-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Proveedores/crear/editar
          </Link> */}
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div
            className={`${
              location.pathname === "/" ? "bg-blue-50" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right font-semibold"
                data-tip="INICIO/ESTADISTICAS/ETC"
              >
                <Link to={"/"}>
                  <FaDatabase className="text-3xl text-blue-700" />
                </Link>
              </div>
            </div>
          </div>

          {user.tipo === "admin" ? (
            ""
          ) : (
            <div
              className={`${
                location.pathname === "/productos" ? "bg-blue-50" : "bg-none"
              } w-full text-center py-2 items-center transition-all`}
            >
              <div className="w-full text-center py-2 items-center transition-all ">
                <div
                  className="tooltip tooltip-right font-semibold"
                  data-tip="PRODUCTOS/CREAR/EDITAR"
                >
                  <Link to={"/productos"}>
                    <FaTable className="text-3xl text-blue-700" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {user.tipo === "admin" ? (
            <div
              className={`${
                location.pathname === "/ordenes" ? "bg-blue-50" : "bg-none"
              } w-full text-center py-2 items-center transition-all`}
            >
              <div className="w-full text-center py-2 items-center transition-all ">
                <div
                  className="tooltip tooltip-right font-semibold"
                  data-tip="ORDENES EMITIDAS POR USUARIOS"
                >
                  <Link to={"/ordenes"}>
                    <FaBook className="text-3xl text-blue-700" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${
                location.pathname === "/ordenes" ? "bg-blue-50" : "bg-none"
              } w-full text-center py-2 items-center transition-all`}
            >
              <div className="w-full text-center py-2 items-center transition-all ">
                <div
                  className="tooltip tooltip-right font-semibold"
                  data-tip="CREAR ORDENES/EDITAR/ETC"
                >
                  <Link to={"/ordenes"}>
                    <FaFileAlt className="text-3xl text-blue-700" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div
            className={`${
              location.pathname === "/proveedores" ? "bg-blue-50" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right font-semibold"
                data-tip="CREAR PROVEEDORES/CARGAR COMPROBANTES/ETC"
              >
                <Link to={"/proveedores"}>
                  <FaCashRegister className="text-3xl text-blue-700" />
                </Link>
              </div>
            </div>
          </div>

          {user.tipo === "admin" && (
            <div
              className={`${
                location.pathname === "/cuentas" ? "bg-blue-50" : "bg-none"
              } w-full text-center py-2 items-center transition-all`}
            >
              <div className="w-full text-center py-2 items-center transition-all ">
                <div
                  className="tooltip tooltip-right"
                  data-tip="REGISTRAR USUARIOS/EDITARLOS/ETC"
                >
                  <Link to={"/cuentas"}>
                    <FaUser className="text-3xl text-blue-700" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
