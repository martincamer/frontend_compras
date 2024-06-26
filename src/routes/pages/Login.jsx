// import { Link } from "react-router-dom";
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
    <section className="flex items-center justify-center gap-12 h-screen  bg-white flex-col relative max-md:px-5">
      <form
        onSubmit={onSubmit}
        className="border border-sky-300 rounded max-md:border-none max-md:w-full max-md:shadow-none max-md:px-1 flex w-1/3 flex-col gap-4 bg-white  px-10 py-12 shadow-lg shadow-slate-300"
      >
        <div className="flex justify-center">
          <h4 className="font-semibold text-2xl text-sky-500">
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
