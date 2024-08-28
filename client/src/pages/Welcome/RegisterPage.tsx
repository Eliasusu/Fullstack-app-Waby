import BoxContainer from "../../components/BoxConteiner.tsx";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    return (
        <>

        <Logo />
        <RegisterUser /> 

        </>
    );
}

function Logo(){
    return (
        <div className="flex items-center justify-center pb-3 pt-3 lg:mt-2 mx-auto">
            <img className="w-[50px] h-[50px] m-3" src="./public/LogoWaby.svg" />
            <p className="font-bold text-white-text text-[40px] ">Waby</p>
        </div>
    );
}

function RegisterUser() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signUp, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();
    console.log(registerErrors);

    useEffect(() => { 
        if(isAuthenticated) navigate('/profile');
    }, [isAuthenticated, navigate]);

    const onSubmit = handleSubmit(async (values: object) => {
        signUp(values);
    });
    return (
    <div className="flex justify-center my-16">
        <BoxContainer width="w-[285px]" height="w-[340]">
                <div className="flex flex-col items-center justify-center w-auto">
                    {
                        Array.isArray(registerErrors) && (registerErrors).map((error: string, index: number) => (
                            <span key={index} className="bg-red p-2 text-white">{error}</span>
                        ))
                    
                    }
                    <form className="w-full flex flex-col gap-3 pt-1" id="formLogin" action="/register" method="POST"
                        onSubmit={onSubmit}>
                    <h1 className="font-bold text-3xl text-white-text m-auto pb-1">Register</h1>
                    <div className="w-full">
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="email" placeholder="Email"
                                {...register('email', { required: true })} /> 
                            {
                                errors.email && <span className="text-red text-xs">Email is required</span>
                            }
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="password" placeholder="Password"
                                {...register('password', { required: true })} />
                            {
                                errors.password && <span className="text-red text-xs">Password is required</span>
                            }                           
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Username"
                                {...register('username', { required: true })} />
                            {
                                errors.username && <span className="text-red text-xs">Username is required</span>
                            }
                    </div>
                     <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Full name"
                                {...register('name', { required: true })} />
                            {
                                errors.name && <span className="text-red text-xs">Name is required</span>
                            }
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="date" placeholder="Birthday"
                                {...register('birthdate', { required: true })} />
                            {
                                errors.birthdate && <span className="text-red text-xs">Birthdate is required</span>
                            }
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="number" placeholder="Weight"
                                {...register('bodyWeight', { required: true })} />
                            {  
                                errors.bodyWeight && <span className="text-red text-xs">Weight is required</span>
                            }
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="number" placeholder="Height"
                                {...register('height', { required: true })} />
                            {
                                errors.height && <span className="text-red text-xs">Height is required</span>
                            }
                    </div>
                    <div>
                        <select  className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm" name="trainingMethod">
                                <option value="emr345nrpzde"
                                    {...register('trainingMethods', { required: true })}>Calisthenics</option>
                                <option value="ojjmdeasf32sd"
                                {...register('trainingMethods', { required: true})}>Gym</option>
                            </select>
                    </div>
                    <div className="flex justify-between ">
                        <div>
                            <input className="mr-2 " type="checkbox" />
                            <label className="font-normal text-xs">Remember me</label>
                        </div>
                    </div>
                    <button className="w-full h-10 rounded-2xl bg-red p-2 hover:bg-redHover transition font-bold" type="submit">Sign Up</button>
                    <div className="w-full">
                        <button className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-loginGoogle hover:bg-grey-loginGoogleHover transition p-2 font-normal text-sm flex items-center justify-center">
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