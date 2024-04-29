import { useEffect, useState } from "react";
import { ModalEditarCuentaRole } from "../../../components/cuenta/ModalEditarCuentaRole";
import { ModalEliminarUsuario } from "../../../components/cuenta/ModalEliminarUsuario";
import { ModalEditarCuentaPassword } from "../../../components/cuenta/ModalEditarCuentaPassword";
import { ModalEditarCuenta } from "../../../components/cuenta/ModalEditarCuenta";
import { ToastContainer } from "react-toastify";
import { Label } from "../../../components/formularios/Label";
import { Input } from "../../../components/formularios/Input";
import { Button } from "../../../components/formularios/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthProvider";
import { InputPassword } from "../../../components/formularios/InputPassword";
import client from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export const AdministrarCuentas = () => {
  const [usuarios, setUsuarios] = useState([]);

  const { signup, error } = useAuth();

  const [isOpenEditar, setEditar] = useState(false);
  const [isOpenEditarRole, setEditarRole] = useState(false);
  const [isEliminar, setEliminar] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEditar = () => {
    setEditar(true);
  };

  const closeEditar = () => {
    setEditar(false);
  };

  const openEditarRole = () => {
    setEditarRole(true);
  };

  const closeEditarRole = () => {
    setEditarRole(false);
  };

  const openEliminar = () => {
    setEliminar(true);
  };

  const closeEliminar = () => {
    setEliminar(false);
  };

  const openPassword = () => {
    setPassword(true);
  };

  const closePassword = () => {
    setPassword(false);
  };

  const handleId = (id) => setObtenerId(id);

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get("/users");

      setUsuarios(res.data);
    };
    loadData();
  }, []);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data);
  });

  return (
    <section className="px-10 py-20 bg-gray-100/50 w-full">
      <ToastContainer />
      <div className="bg-white py-10 px-10 shadow-lg rounded-xl border-[1px] mt-10">
        <div className="flex">
          <h4 className="font-semibold text-2xl text-sky-500">
            Te damos la bienvenida a la configuracion 👋
          </h4>
        </div>
        <div className="text-base font-medium text-slate-500">
          Edita y crea nuevos{" "}
          <span className="font-bold text-slate-600">Usuarios</span>.
        </div>

        <article className="mt-5">
          <h4 className="font-semibold text-xl text-sky-500 mb-4">
            <span className="underline">Tabla de usuarios registrados</span> 😃
          </h4>
          <div className="">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Fabrica</th>
                  <th>Localidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr>
                    <th className="capitalize">{u.username}</th>
                    <th className="capitalize">{u.email}</th>
                    <td className="capitalize">{u.fabrica}</td>
                    <td className="capitalize">{u.localidad}</td>
                    <td className="capitalize flex">
                      <p
                        className={`${
                          u.role_id === 1
                            ? "bg-green-100 py-2 px-5 rounded-2xl text-green-700 font-semibold"
                            : "bg-orange-100 py-2 px-5 rounded-2xl text-orange-700 font-semibold"
                        }`}
                      >
                        {u.role_id === 1 ? "activo" : "inactivo"}
                      </p>
                    </td>

                    <td>
                      <div className="dropdown dropdown-left z-1">
                        <div
                          tabIndex={0}
                          role="button"
                          className="hover:bg-slate-100 rounded-full px-2 py-2 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                            />
                          </svg>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow-lg border bg-base-100 rounded-box w-52 gap-2"
                        >
                          <li>
                            <span
                              className="text-center bg-green-500/90 text-white hover:bg-green-500 py-2 px-3 rounded-xl text-sm"
                              onClick={() => {
                                handleId(u.id), openEditarRole();
                              }}
                            >
                              EDITAR ROL
                            </span>
                          </li>
                          <li>
                            <span
                              className="text-center bg-green-500/90 text-white hover:bg-green-500 py-2 px-3 rounded-xl text-sm"
                              onClick={() => {
                                handleId(u.id), openPassword();
                              }}
                            >
                              EDITAR CONTRASEÑA
                            </span>
                          </li>
                          <li>
                            <span
                              className="text-center bg-red-500/90 text-white hover:bg-red-500 py-2 px-3 rounded-xl text-sm"
                              onClick={() => {
                                handleId(u.id), openEliminar();
                              }}
                            >
                              ELIMINAR USUARIO
                            </span>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10">
            <h4 className="font-semibold text-md text-sky-500 mb-4">
              <span className="underline">Crear nuevo usuario</span> 😃
            </h4>

            <form
              onSubmit={onSubmit}
              className="flex w-1/3 flex-col gap-4 bg-white border-[1px] border-slate-300 px-10 py-10 rounded-xl  shadow"
            >
              <div className="text-lg font-bold text-slate-500 w-full text-center">
                Registrar nuevo usuario
              </div>
              {
                <div>
                  <div className="flex flex-col gap-1">
                    {error?.map((e) => (
                      <span className="bg-red-500/10 rounded-lg px-2 py-1 text-red-600 text-sm border-[1px] border-red-500/30">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              }
              <div className="flex flex-col gap-2">
                <Label label="Email del registro" />
                <Input
                  register={register}
                  placeholder={"emailregistro@email.com"}
                  type={"email"}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Usuario" />
                <Input
                  register={register}
                  placeholder={"@Usuario"}
                  type={"username"}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Localidad" />
                <Input
                  register={register}
                  placeholder={"@Localidad"}
                  type={"localidad"}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Fabrica" />
                <Input
                  register={register}
                  placeholder={"@Fabrica"}
                  type={"fabrica"}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Tipo" />
                <select
                  {...register("tipo", { required: true })}
                  className="bg-gray-200/90 font-bold text-slate-800 py-2 px-1 rounded-xl"
                >
                  <option value="">Seleccionar el tipo</option>
                  <option value="admin">Admin</option>
                  <option value="user">Usuario</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label label="Contraseña" />
                <InputPassword register={register} type={"password"} />
              </div>

              <Button type={"submit"} titulo={"Registrar Usuario"} />
            </form>
          </div>
        </article>
      </div>

      <ModalEditarCuenta
        isOpen={isOpenEditar}
        closeModal={closeEditar}
        obtenerId={obtenerId}
      />
      <ModalEditarCuentaRole
        isOpen={isOpenEditarRole}
        closeModal={closeEditarRole}
        obtenerId={obtenerId}
      />

      <ModalEliminarUsuario
        isOpen={isEliminar}
        closeModal={closeEliminar}
        obtenerId={obtenerId}
      />

      <ModalEditarCuentaPassword
        isOpen={isPassword}
        closeModal={closePassword}
        obtenerId={obtenerId}
      />
    </section>
  );
};
