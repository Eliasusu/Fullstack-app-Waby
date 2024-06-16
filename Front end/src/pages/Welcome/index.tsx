import BoxContainer from "../../components/BoxConteiner";

export default function Welcome(){
    return (
        <>

        <Logo />
        <Slogan textColor='Create' text='your exercises.' />
        <Slogan textColor='Planned' text='your routines.' />

        <Login /> 

        </>
    );
}

function Logo(){
    return (
        <div className="flex items-center justify-center pb-16 pt-3 m-auto">
            <img className="w-[50px] h-[50px] m-3" src="./public/LogoWaby.svg" />
            <p className="font-bold text-white-text text-[40px] ">Waby</p>
        </div>
    );
}


function Slogan({textColor, text}: {textColor: string, text: string}){
    return (
        <div className="flex items-center justify-center">
            <span className="text-[30px] text-grey-loginGoogleHover hover:text-red transition duration-300 font-bold mx-2 ">{textColor}</span><p className="text-[30px] text-white-text font-normal ">{text}</p>
        </div>
    );
}

function Login(){
    return (
    <div className="flex justify-center my-16">
        <BoxContainer width="w-[285px]" height="w-[340]">
            <div className="flex flex-col items-center justify-center w-auto">
                <form className="w-full flex flex-col gap-3 pt-1">
                    <h1 className="font-bold text-3xl text-white-text m-auto pb-1">Welcome!</h1>
                    <div className="w-full">
                        <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="text" placeholder="Enter your email or user" />
                    </div>
                    <div>
                        <input className="w-full h-10 border-[1px] rounded-2xl border-white/60 bg-grey-login p-2 font-normal text-sm caret-redHover focus:outline-none" type="password" placeholder="Enter your password" />
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
                    <button className="w-full h-10 rounded-2xl bg-red p-2 hover:bg-redHover transition font-bold" type="submit">Sign In</button>
                    <div className="flex justify-center">
                        <p className="font-normal text-sm mr-1">Don't have an account?</p>
                        <a className="text-sm" href="#">Sign Up</a>
                    </div>
                    <p className="m-auto font-normal text-sm">or</p>
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