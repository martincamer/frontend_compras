import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

export const NavbarStatick = () => {
  const { user, signout, isAuth } = useAuth();

  console.log(user);

  return (
    isAuth && (
      <div className="absolute top-2 right-10 flex gap-2 items-start z-1 max-md:top-5">
        <div className="navbar gap-2">
          <div className="navbar-end">
            <button className="btn btn-ghost hover:bg-slate-200 btn-circle">
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
                      "https://media-eze1-1.cdn.whatsapp.net/v/t61.24694-24/143144780_433365128082776_2065965210607516755_n.jpg?ccb=11-4&oh=01_Q5AaIM0at3JRy1pLTQOpc4pAfeapqNoOS7IePIqPgF0glU69&oe=66364645&_nc_sid=e6ed6c&_nc_cat=103"
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
