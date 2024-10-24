import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from './ui/logo.tsx'
import Cookie from "js-cookie";
import { useAuth } from '@/users/auth.context.tsx';


// Funcion que del token extrae los datos del user que se logueo
const getUserFromToken = () => {
  const token = Cookie.get('token')
  if (!token) return null

  const [, payload] = token.split('.')
  const data = JSON.parse(atob(payload))
  return data
}

export default function Header() {
  const [greeting, setGreeting] = useState('')
  const { logout } = useAuth();
  const user = getUserFromToken()

  const onClick = () => {
    logout();
  }

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setGreeting('Buenos días')
      else if (hour >= 12 && hour < 18) setGreeting('Buenas tardes')
      else setGreeting('Buenas noches')
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex justify-between items-center bg-background p-4 text-white">
      <Logo dimensions='w-[30px]' />
      <div className="flex-grow text-center">
        <p className="text-white text-lg">
          <span className="font-light">{greeting}</span>, <span className="font-bold">{user.username}</span>
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.username}@gmail.com`} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-grey-nav border-white/60">
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='font-light hover:bg-grey-box'
            onClick={() => window.location.href = '/profile'}
          >Profile</DropdownMenuItem>
          <DropdownMenuItem className='font-light hover:bg-grey-box'>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='hover:bg-grey-box' onClick={onClick}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}