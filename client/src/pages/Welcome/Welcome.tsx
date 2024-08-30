

export default function Welcome(){
    return (
        <>
        <div className="m-auto">
            <Logo />
            <div className="lg:mt-5 xs:mt-4">
                <Slogan textColor='Create' text='your exercises.' />
                <Slogan textColor='Planned' text='your routines.' />
            </div>
            <div className="flex items-center justify-center mt-12">
                    <a href="/login"  className="bg-red text-white-text font-bold text-[20px] py-2 px-4 rounded-lg hover:bg-redHover transition duration-300" >Get Started</a>
            </div>
        </div>
        </>
    );
    
    function Logo(){
    return (
            <div className="flex items-center justify-center pb-3 pt-3 lg:mt-2 mx-auto">
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
}