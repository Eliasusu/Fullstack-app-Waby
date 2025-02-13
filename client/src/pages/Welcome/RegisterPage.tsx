import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { useForm } from "react-hook-form";
import { useAuth } from "@/users/auth.context.tsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/users/user.type";



export default function Register() {
    return (
        <>
            <div className="h-screen m-auto flex items-center justify-center">
                <RegisterUser />
            </div>
        </>
    );
}

function RegisterUser() {
    const { register} = useForm();
    const { signUp, isAuthenticated, errors } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
        if (isAuthenticated) navigate('/home');
    }, [isAuthenticated, navigate]);

    const handleCreateUserSubmit = async () => {
        console.log('user en el handleCreateUserSubmit', user);
        signUp(user);
    };

    const hangleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault()
        setUser({...user, [evt.target.name]: evt.target.value})
        console.log('user en el hangleChange', user);
    }

    return (
        <div className="flex justify-center my-8">
            <BoxContainer width="w-[285px]" height="w-[340]" padding="p-5">
                <div className="flex flex-col items-center justify-center w-auto">
                    <form className="w-full flex flex-col gap-3 pt-1" id="formLogin" action="/register" method="POST">
                        <h1 className="font-bold text-3xl text-white-text pb-1">Register</h1>
                        <div className="w-full">
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'email')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="email" placeholder="Email"
                                {...register('email', { required: true })} onChange={hangleChange} />
                        </div>
                        <div> 
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'password')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="password" placeholder="Password"
                                {...register('password', { required: true })} onChange={hangleChange} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'username')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Username" id="username"
                                {...register('username', { required: true })} onChange={hangleChange} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'name')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Full name"
                                {...register('name', { required: true })} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'birthdate')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="date" placeholder="Birthday"
                                {...register('birthdate', { required: true })} onChange={hangleChange} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'bodyWeight')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="number" placeholder="Weight"
                                {...register('bodyWeight', { required: true })} onChange={hangleChange} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'height')?.message}</p>}
                            <input className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="number" placeholder="Height"
                                {...register('height', { required: true })} onChange={hangleChange} />
                        </div>
                        <div>
                            {errors && <p className="text-red text-xs">{errors.find(e => e.path[0] === 'trainingMethods')?.message}</p>}
                            <select 
                                className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-login p-2 font-normal text-sm" 
                                {...register('trainingMethods', { required: true })}
                                onChange={(e) => setUser({...user, trainingMethods: e.target.value})}
                            >
                                <option value="calisthenics">Calisthenics</option>
                                <option value="gym">Gym</option>
                            </select>
                        </div>
                        <div className="flex justify-between ">
                            <div>
                                <input className="mr-2 " type="checkbox" />
                                <label className="font-normal text-xs">Remember me</label>
                            </div>
                        </div>
                        <button 
                        className="w-full h-10 rounded-xl bg-red p-2 hover:bg-redHover transition font-bold" 
                        type="submit"
                        onClick={handleCreateUserSubmit}
                        >Sign Up</button>
                        <div className="w-full">
                            <button className="w-full h-10 border-[1px] rounded-xl border-white/60 bg-grey-loginGoogle hover:bg-grey-loginGoogleHover transition p-2 font-normal text-sm flex items-center justify-center">
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