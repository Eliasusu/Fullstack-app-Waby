import { useState } from "react";

export default function NavBar() {

    const [active, setActive] = useState(2);

  return (
    <div className="xs:w-[290px] xs:h-[60px] bg-grey-nav/80 shadow-lg backdrop-blur-[4px] rounded-full m-auto inset-x-0 bottom-4 fixed content-center">
        <nav className="flex justify-around mx-4">
            <div 
            className={`cursor-pointer ${active === 0 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            onClick={() => setActive(0)}
            >
                <img src="analitics.svg" alt="analitics" className="w-[20px] h-[20px] m-auto" />
            </div>
            <div className={`cursor-pointer ${active === 1 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            onClick={() => setActive(1)}>
                <img src="calendar.svg" alt="calendar" className="w-[20px] h-[20px] m-auto" />
            </div>
            <div className={`cursor-pointer ${active === 2 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            onClick={() => setActive(2)}>
                <img src="home.svg" alt="home" className="w-[20px] h-[20px] m-auto" />
            </div> 
            <div className={`cursor-pointer ${active === 3 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            onClick={() => setActive(3)}>
            <img src="goals.svg" alt="goals" className="w-[20px] h-[20px] m-auto" />
            </div>
            <div className={`cursor-pointer ${active === 4 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            onClick={() => setActive(4)}>
                <img src="newRoutine.svg" alt="new" className="w-[20px] h-[20px] m-auto" />
            </div>
        </nav>
    </div>
  );    
}

