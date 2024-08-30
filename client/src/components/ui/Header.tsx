import { useState, useEffect } from 'react'
import Logo from './logo.tsx'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { useAuth } from "@/context/AuthContext.tsx";

export default function Header() {
    const [greeting, setGreeting] = useState('')
    const [username, setUsername] = useState('Usuario')
    const { user } = useAuth();
    
  useEffect(() => {
    // Función para obtener el saludo según la hora
    function getGreeting() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        return 'Buenos días';
      } else if (hour >= 12 && hour < 20) {
        return 'Buenas tardes';
      } else {
        return 'Buenas noches';
      }
    }

    // Actualizar el saludo
    setGreeting(getGreeting())

    // Simular la obtención del nombre de usuario
    // En una aplicación real, esto vendría de tu sistema de autenticación
      // eslint-disable-next-line react-hooks/rules-of-hooks
    
      setUsername((user as string[])[0])

    // Actualizar el saludo cada minuto
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [user])
  return (
    <header className="bg-grey-nav px-4 py-2 flex items-center justify-between backdrop-blur-[6px] shadow-lg">
      {/* Logo de la aplicación */}
      <div className="flex items-center">
        <Logo/>
      </div>

     {/* Mensaje personalizado con saludo y nombre de usuario */}
      <div className="flex-grow text-center">
        <p className="text-white text-lg">
          <span className="font-light">{greeting}</span>, <span className="font-bold">{username}</span>
        </p>
      </div>

      {/* Avatar del usuario */}
      <Avatar className="h-10 w-10">
        <AvatarImage src="?height=40&width=40" alt="Foto de perfil del usuario" />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
    </header>
  )
}