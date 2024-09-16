import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { User } from "@/types/user.type.ts";

export default function LoginPage(){
    return (
        <>
        <div className="m-auto">
        <Login /> 
        </div>
        </>
    );
}

function Login() {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const { signIn, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();
    useEffect(() => { 
        if(isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (values) => {
        const user: User = {
            username: values.username,
            avatar: values.username,
            password: values.password,
            email: values.email,
            name: values.name,
            birthdate: values.birthdate,
            phone: values.phone,
            bodyWeight: values.bodyWeight,
            height: values.height,
        };
        signIn(user);
    });
    
        return (
            <div className="flex justify-center my-16">
                <BoxContainer width="w-[285px]" height="w-[340]" padding="p-5">
                    <div className="flex flex-col items-center justify-center w-auto">
                    {
                        Array.isArray(registerErrors) && (registerErrors).map((error: string, index: number) => (
                            <div key={index} className="bg-red w-auto p-2 mb-3 text-white text-xs rounded-md " >{error}</div>
                        ))
                    
                    }
                        <form className="w-full flex flex-col gap-3 pt-1" id="formLogin" action="/login" method="POST" onSubmit={onSubmit}>
                            <h1 className="font-bold text-3xl text-white-text pb-1">Welcome!</h1>
                            <div>
                                <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Username"
                                    {...register('username', { required: true })}/>
                                {
                                    errors.username && <span className="text-red text-xs">Username is required</span>
                                }
                            </div>
                            <div>
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="password" placeholder="Password"
                                    {...register('password', { required: true })}/>
                                {
                                    errors.password && <span className="text-red text-xs">Password is required</span>
                                }                           
                            </div>
                            <div className="flex justify-between ">
                                <div>
                                    <input className="mr-2 " type="checkbox" />
                                    <label className="font-normal text-xs">Remember me</label>
                                </div>
                                <div>
                                    <a className="text-xs font-normal" href="#">Forgot your password?</a>
                                </div>
                            </div>
                            <button className="w-full h-10 rounded-xl bg-red p-2 hover:bg-redHover transition font-bold" type="submit">Sign In</button>
                            <div className="flex justify-center">
                                <p className="font-normal text-sm mr-1">Don't have an account?</p>
                                <a className="text-sm" href="/register">Sign Up</a>
                            </div>
                            <p className="m-auto font-normal text-sm">or</p>
                            <div className="w-full">
                                <button className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-loginGoogle hover:bg-grey-loginGoogleHover transition p-2 font-normal text-sm flex items-center justify-center">
                                    Sign in with Google
                                    <img className="ml-2" src="logoGoogle.svg" alt="logoGoogle" />
                                </button>
                            </div>

                        </form>
                    </div>
                </BoxContainer>
            </div>
        );
    }
