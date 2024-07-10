import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Label } from "../../components/formularios/Label";
import { Input } from "../../components/formularios/Input";
import { Button } from "../../components/formularios/Button";
import { InputPassword } from "../../components/formularios/InputPassword";

export const Login = () => {
  const { signin, error } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/");
    }
  });

  return (
    <section className="flex items-center gap-12 h-screen  bg-white relative max-md:px-5">
      <div className="max-md:hidden h-screen w-1/3 bg-gradient-to-br from-black/95 to-gray-700 flex gap-2 flex-col justify-center">
        <p className="text-white text-center font-bold text-2xl px-10">
          Bienvenido al sistema de compras de tecnohouse.
        </p>
        <p className="text-white text-center mt-2 px-20 font-normal">
          Crea tus primeras ordenes de compra, gestiona tus proveedores, saldos,
          etc.
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded max-md:border-none max-md:w-full max-md:shadow-none max-md:px-1 flex w-1/3 flex-col gap-4 bg-white  px-10 py-12 border mx-auto shadow"
      >
        <div className="flex justify-center">
          <h4 className="font-semibold text-2xl text-blue-500">
            Te damos la bienvenida 👋
          </h4>
        </div>
        <div className="text-base font-medium text-slate-500 text-center">
          Ingresa al sistema de compras de{" "}
          <span className="font-bold text-slate-600">Tecnohouse</span>.
        </div>
        {
          <div>
            <div className="flex flex-col gap-1">
              {error?.map((e) => (
                <span className="bg-red-100 rounded-xl px-3 text-center uppercase py-3 text-red-800 text-sm">
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
          <Label label="Contraseña del registro" />
          <InputPassword
            register={register}
            placeholder={""}
            type={"password"}
          />
        </div>
        <div className="flex w-1/3 max-md:w-full">
          <Button type={"submit"} titulo={"Iniciar Sesión"} />
        </div>
        <div className="text-sm font-medium text-center mt-5 w-1/2 mx-auto max-md:w-full">
          Si, pide a tu administrador que te cree un usuario 👀.
        </div>
      </form>
    </section>
  );
};
