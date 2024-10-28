    
export default function Logo({dimensions}: {dimensions: string}) {
return (
            <div className="flex items-center justify-center pb-3 pt-3 lg:mt-2">
                <img className={`${dimensions}`} src="./public/LogoWaby.svg" />
            </div>
        );
    }