import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const [click, setClick] = useState(false);
  const { signout } = useAuth();

  const toggleSidebar = () => {
    setClick(!click);
  };

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (scrollY > 0) {
          navbar.style.opacity = "0.5"; // Cambiar la opacidad cuando se hace scroll
        } else {
          navbar.style.opacity = "1"; // Restaurar la opacidad cuando se encuentra en la parte superior
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="navbar" // ID para identificar el elemento
        className="fixed left-0 top-0 z-[1] p-1 px-4 max-md:px-4"
        onClick={() => toggleSidebar()}
      >
        <div className="py-4">
          <a
            onClick={() => toggleSidebar()}
            href="#"
            className="t group relative flex justify-center rounded bg-slate-200 px-2 py-1.5 text-black-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 max-md:h-6 max-md:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>

            <span className="invisible absolute start-full w-[120px] text-center top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              Abrir Navegación
            </span>
          </a>
        </div>
      </div>
      <div
        className={`${
          !click
            ? "hidden max-h-full min-h-full h-full"
            : "block fixed z-[100] shadow-black/10 shadow-md h-full max-h-full min-h-full"
        } flex transition-all ease-in-out duration-300 z-50`}
      >
        <div className="flex w-16  max-md:w-14 flex-col justify-between border-e bg-white h-full max-h-full min-h-full">
          <div className="">
            <div className="border-t border-slate-300 ">
              <div className="px-2">
                <div className="py-4">
                  <a
                    onClick={() => toggleSidebar()}
                    href="#"
                    className="t group relative flex justify-center rounded bg-slate-200 px-2 py-1.5 text-black-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <span className="invisible absolute start-full w-[120px] text-center top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Cerrar Navegacion
                    </span>
                  </a>
                </div>

                <ul className="space-y-1 flex flex-col border-t border-slate-300 pt-4 ">
                  <Link to={"/"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
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
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Inicio
                      </span>
                    </a>
                  </Link>

                  <Link to={"/productos"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/productos"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
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
                          d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Productos cargados
                      </span>
                    </a>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2 ">
            <form action="#">
              <button
                //   type="submit"
                type="button"
                onClick={() => signout()}
                className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                  />
                </svg>

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Salir de la aplicación
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
