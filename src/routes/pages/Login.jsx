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

  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/");
    }
  });

  return (
    <section className="flex items-center gap-12 h-screen bg-white relative max-md:px-2">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl max-md:w-full max-md:shadow-none flex w-1/3 flex-col gap-4 bg-gray-800  px-10 py-12 mx-auto max-md:px-4"
      >
        <div className="flex justify-center">
          <img
            className="w-[40px]"
            src="https://app.holded.com/assets/img/brand/holded-logo.svg"
          />
        </div>
        <div className="flex justify-center">
          <h4 className="font-semibold text-2xl text-white max-md:text-xl">
            Te damos la bienvenida 👋
          </h4>
        </div>
        <div className="text-xl font-medium text-center max-md:text-sm text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-violet-300">
          Ingresa al sistema de Compras de{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">
            Tecnohouse
          </span>
          .
        </div>
        {
          <div className="w-full flex justify-center">
            <div className="flex flex-col gap-1 items-start justify-center">
              {error?.map((e) => (
                <span
                  key={e}
                  className="bg-gradient-to-r from-red-400 to-red-100 rounded-xl px-3 text-center uppercase py-3 text-red-900 text-sm font-extrabold "
                >
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
        <div className="flex max-md:w-full">
          <Button type={"submit"} titulo={"Iniciar Sesión"} />
        </div>
        <div className="text-sm font-medium text-center mt-5 w-1/2 mx-auto max-md:w-full text-gray-400">
          Si, pide a tu administrador que te cree un usuario 👀.
        </div>
      </form>
    </section>
  );
};
