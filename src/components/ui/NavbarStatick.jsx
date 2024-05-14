import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import client from "../../api/axios";

export const NavbarStatick = () => {
  const { user, signout, isAuth } = useAuth();

  const [comprobantes, setComprobantes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get("/comprobantes-dia");

      setComprobantes(res.data);
    };
    loadData();
  }, []);

  return (
    isAuth && (
      <div className="absolute top-2 right-10 flex gap-2 items-start z-1 max-md:top-5 max-md:hidden">
        <div className="navbar gap-2">
          <div className="navbar-end dropdown dropdown-end">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-ghost hover:bg-slate-200 btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-xs indicator-item bg-sky-400"></span>
              </div>
            </button>
            <ul
              tabIndex={0}
              className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80 border"
            >
              <div className="py-2 px-3 text-center capitalize font-bold text-slate-700">
                {"NOTIFICACIONES"}
              </div>

              <div className="h-[10vh] overflow-y-scroll scroll-bar px-2 py-2 flex flex-col gap-2">
                {comprobantes.map((c) => (
                  <div className="border py-2 px-3 rounded-xl flex flex-wrap gap-1">
                    <p>N ° {c.id}</p>,
                    <p>
                      Orden total{" "}
                      <span className="font-bold">
                        {" "}
                        {Number(c.total).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </span>
                    </p>
                    ,<p>{c.proveedor}</p>
                  </div>
                ))}
              </div>
            </ul>
          </div>
          <div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar hover:shadow-md rounded-full transition-all w-full "
              >
                <div className="rounded-full h-[60px] w-[60px]">
                  <img
                    src={
                      "https://e7.pngegg.com/pngimages/507/702/png-clipart-profile-icon-simple-user-icon-icons-logos-emojis-users.png"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border"
              >
                <div className="py-2 px-3 text-center capitalize font-bold text-slate-700">
                  {user?.username}
                </div>
                <div className="py-2 px-3 text-center capitalize font-light text-xs text-slate-700">
                  {user?.email}
                </div>
                <li>
                  <button type="button" onClick={() => signout()}>
                    Salir de la aplicación
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
