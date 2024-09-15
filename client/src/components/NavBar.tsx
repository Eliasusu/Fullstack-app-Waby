import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {

  const [active, setActive] = useState(2);
  const navigate = useNavigate();
  console.log('ESTADO', active)

  useEffect(() => { 
    if (window.location.pathname === '/calendar') {
      setActive(1)
    } else if (window.location.pathname === '/home') {
      setActive(2)
    } else if (window.location.pathname === '/create') {
      setActive(3)
    }
  }, [])


  return (
    <div className="xs:w-[290px] xs:h-[60px] bg-grey-nav/80 shadow-lg backdrop-blur-[4px] rounded-full m-auto inset-x-0 bottom-4 fixed content-center">
        <nav className="flex justify-around mx-4">
            <div className={`cursor-pointer ${active === 1 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
                  onClick={() => {
                      setActive(1)
                        navigate('/calendar')
                  }
                
            }>
                <img src="calendar.svg" alt="calendar" className="w-[20px] h-[20px] m-auto" />
            </div>
            <div className={`cursor-pointer ${active === 2 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
              onClick={() => {
                setActive(2)
                  navigate('/home')
              }}>
                <img src="home.svg" alt="home" className="w-[20px] h-[20px] m-auto" />
            </div> 
              <div className={`cursor-pointer ${active === 3 ? 'bg-red' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
                  onClick={() => {
                    setActive(3)
                      navigate('/create')
                  }}>
                <img src="newRoutine.svg" alt="new" className="w-[20px] h-[20px] m-auto" />
            </div>
        </nav>
    </div>
  );    
}

