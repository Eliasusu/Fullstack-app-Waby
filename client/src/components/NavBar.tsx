import { NavLink } from "react-router-dom";
import { Layers } from "lucide-react";

type NavItem = { to: string; label: string; icon: string | typeof Layers };

const items: NavItem[] = [
  { to: '/calendar', icon: '/calendar.svg', label: 'Calendario' },
  { to: '/mesocycles', icon: Layers, label: 'Mesociclos' },
  { to: '/home', icon: '/home.svg', label: 'Inicio' },
  { to: '/create', icon: '/newRoutine.svg', label: 'Crear' },
  { to: '/goals', icon: '/goals.svg', label: 'Metas' },
];

/** Barra de navegación inferior. La sección activa sale de la URL (nota 67), no de un estado propio. */
export default function NavBar() {
  return (
    <div className="w-[calc(100%-1.5rem)] max-w-[340px] h-[60px] bg-secondary-nav/80 shadow-lg backdrop-blur-[4px] rounded-full m-auto inset-x-0 bottom-4 fixed content-center">
      <nav className="flex justify-around mx-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) => `cursor-pointer ${isActive ? 'bg-primary' : ''} w-[35px] h-[35px] rounded-xl p-2 transition duration-150`}
            >
              {typeof Icon === 'string'
                ? <img src={Icon} alt="" className="w-[20px] h-[20px] m-auto" />
                : <Icon aria-hidden className="w-[20px] h-[20px] m-auto text-white" />}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
