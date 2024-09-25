import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { MenuMobile } from "./MenuMobile";

export const Navbar = () => {
  const { signout, user } = useAuth();

  return (
    <header className="bg-gray-800 py-5 px-10 flex items-center justify-between max-md:items-end max-md:justify-end">
      <div className="hidden max-md:block">
        <MenuMobile />
      </div>
      <div className="flex gap-10 items-center max-md:hidden">
        <Link to={"/"} className="cursor-pointer">
          <img src="https://app.holded.com/assets/img/brand/holded-logo.svg" />
        </Link>
        <div className="flex gap-2">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
            >
              Productos
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white p-1 rounded-md w-52 text-sm font-medium shadow-xl gap-1"
            >
              <li className="hover:bg-gray-800 hover:text-white rounded-md">
                <Link to={"/productos"}>Sector productos</Link>
              </li>{" "}
            </ul>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
            >
              Acciones
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white p-1 rounded-md w-64 text-sm font-medium shadow-xl gap-1"
            >
              <li className="hover:bg-gray-800 hover:text-white rounded-md">
                <Link to={"/ordenes"}>Sector ordenes de compra</Link>
              </li>{" "}
              <li className="hover:bg-gray-800 hover:text-white rounded-md">
                <Link to={"/presupuestos"}>Sector de presupuestos</Link>
              </li>{" "}
              {user.fabrica === "parque industrial" && (
                <>
                  <li className="hover:bg-gray-800 hover:text-white rounded-md">
                    <Link to={"/viviendas-costos"}>
                      Sector modelos de casas
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="text-white font-semibold hover:bg-gray-700 py-1 px-4 rounded-md transition-all"
            >
              Proveedores
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white p-1 rounded-md w-52 text-sm font-medium shadow-xl gap-1"
            >
              <li className="hover:bg-gray-800 hover:text-white rounded-md">
                <Link to={"/proveedores"}>Sector proveedores</Link>
              </li>{" "}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-semibold text-blue-500 bg-white px-4 py-1 text-sm rounded-md max-md:hidden">
          <span className="font-bold text-black">Usuario:</span>{" "}
          <span className="capitalize">{user.username}</span>
        </div>
        <button
          onClick={() => signout()}
          className="font-semibold text-white bg-primary px-4 py-1 text-sm rounded-md"
        >
          Salir de la cuenta
        </button>
      </div>
    </header>
  );
};
