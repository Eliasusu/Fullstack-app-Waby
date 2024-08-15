import BoxContainer from "../../components/BoxConteiner";
import { useForm } from "react-hook-form";

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
        const { register, handleSubmit } = useForm();
        const onSubmit = (data: unknown) => { 
        console.log(data);
    }

    return (
    <div className="flex justify-center my-16">
        <BoxContainer width="w-[285px]" height="w-[340]">
            <div className="flex flex-col items-center justify-center w-auto">
                <form className="w-full flex flex-col gap-3 pt-1" id="formLogin" action="/register" method="POST" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="font-bold text-3xl text-white-text m-auto pb-1">Register</h1>
                    <div className="w-full">
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Email" id="email"
                                {...register('email', { required: true })} />
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Password" id="password"
                            {...register('password', {required: true})} />
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Username" id="username"
                            {...register('username', {required: true})}/>
                    </div>
                     <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Full name" id="name"
                            {...register('name', {required: true})}/>
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="date" placeholder="Birthday" id="birthday"
                            {...register('birthday', {required: true})}/>
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Weight" id="weight"
                            {...register('weight', {required: true})}/>
                    </div>
                    <div>
                            <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Height" id="height"
                            {...register('height', { required: true })} />
                    </div>
                    <div>
                        <select  className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm" name="trainingMethod" id="trainingMethod">
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