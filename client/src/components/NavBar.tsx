import { NavLink } from "react-router-dom";

const items = [
  { to: '/calendar', icon: '/calendar.svg', label: 'Calendario' },
  { to: '/home', icon: '/home.svg', label: 'Inicio' },
  { to: '/create', icon: '/newRoutine.svg', label: 'Crear' },
  { to: '/goals', icon: '/goals.svg', label: 'Metas' },
];

/** Barra de navegación inferior. La sección activa sale de la URL (nota 67), no de un estado propio. */
export default function NavBar() {
  return (
    <div className="xs:w-[290px] xs:h-[60px] bg-secondary-nav/80 shadow-lg backdrop-blur-[4px] rounded-full m-auto inset-x-0 bottom-4 fixed content-center">
      <nav className="flex justify-around mx-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            title={item.label}
            className={({ isActive }) => `cursor-pointer ${isActive ? 'bg-primary' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
          >
            <img src={item.icon} alt="" className="w-[20px] h-[20px] m-auto" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
