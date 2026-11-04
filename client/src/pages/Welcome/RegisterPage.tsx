import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IdSchema, RegisterSchema } from "@waby/shared";
import { useAuth } from "@/users/auth.context.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainingMethod } from "@/trainingMethods/training-method.context.tsx";

export default function Register() {
    return (
        <>
            <div className="m-auto">
                <RegisterUser />
            </div>
        </>
    );
}

/** El contrato pide una lista de métodos; este formulario elige uno. */
const RegisterFormSchema = RegisterSchema.omit({ trainingMethodIds: true }).extend({
    trainingMethodId: z.coerce.number().pipe(IdSchema),
});
type RegisterForm = z.infer<typeof RegisterFormSchema>;

const inputClass = "w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none";

function RegisterUser() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(RegisterFormSchema) });
    const { signUp, isAuthenticated } = useAuth();
    const { trainingMethods, getAllTrainingMethods } = useTrainingMethod();
    const [registerErrors, setRegisterErrors] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllTrainingMethods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async ({ trainingMethodId, ...values }) => {
        const result = await signUp({ ...values, trainingMethodIds: [trainingMethodId] });
        setRegisterErrors(result.ok ? [] : result.errors);
    });

    return (
        <div className="flex justify-center my-8">
            <BoxContainer width="w-[285px]" height="w-[340]" padding="p-5">
                <div className="flex flex-col items-center justify-center w-auto">
                    {
                        registerErrors.map((error, index) => (
                            <div key={index} className="bg-red w-auto p-2 mb-3 text-white text-xs rounded-md " >{error}</div>
                        ))
                    }
                    <form className="w-full flex flex-col gap-3 pt-1" id="formLogin" onSubmit={onSubmit} noValidate>
                        <h1 className="font-bold text-3xl text-white-text pb-1">Register</h1>
                        <div className="w-full">
                            <input className={inputClass} type="email" placeholder="Email" {...register('email')} />
                            {errors.email && <span className="text-red text-xs">{errors.email.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="password" placeholder="Password" {...register('password')} />
                            {errors.password && <span className="text-red text-xs">{errors.password.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="text" placeholder="Username" id="username" {...register('username')} />
                            {errors.username && <span className="text-red text-xs">{errors.username.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="text" placeholder="Full name" {...register('name')} />
                            {errors.name && <span className="text-red text-xs">{errors.name.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="date" placeholder="Birthday" {...register('birthdate')} />
                            {errors.birthdate && <span className="text-red text-xs">{errors.birthdate.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="number" step="0.1" placeholder="Weight (kg)" {...register('bodyWeightKg', { valueAsNumber: true })} />
                            {errors.bodyWeightKg && <span className="text-red text-xs">{errors.bodyWeightKg.message}</span>}
                        </div>
                        <div>
                            <input className={inputClass} type="number" placeholder="Height (cm)" {...register('heightCm', { valueAsNumber: true })} />
                            {errors.heightCm && <span className="text-red text-xs">{errors.heightCm.message}</span>}
                        </div>
                        <div>
                            <select className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm" {...register('trainingMethodId')}>
                                {trainingMethods.map((method) => (
                                    <option key={method.id} value={method.id}>{method.name}</option>
                                ))}
                            </select>
                            {errors.trainingMethodId && <span className="text-red text-xs">Elegí un método de entrenamiento</span>}
                        </div>
                        <div className="flex justify-between ">
                            <div>
                                <input className="mr-2 " type="checkbox" />
                                <label className="font-normal text-xs">Remember me</label>
                            </div>
                        </div>
                        <button className="w-full h-10 rounded-xl bg-red p-2 hover:bg-redHover transition font-bold" type="submit">Sign Up</button>
                        <div className="w-full">
                            <button type="button" className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-loginGoogle hover:bg-grey-loginGoogleHover transition p-2 font-normal text-sm flex items-center justify-center">
                                Or sign up with Google
                                <img className="ml-2" src="logoGoogle.svg" alt="logoGoogle" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <p className="font-normal text-sm mr-1">Do you have an account?</p>
                            <a className="text-sm" href="/login">Sign In</a>
                        </div>

                    </form>
                </div>
            </BoxContainer>
        </div>
    );
}
