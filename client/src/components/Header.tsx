import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from './ui/logo.tsx'
import { useAuth } from '@/users/auth.context.tsx';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const [greeting, setGreeting] = useState('')
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const username = user?.username ?? ''

  const onClick = async () => {
    await logout();
    navigate('/login');
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
          <span className="font-light">{greeting}</span>, <span className="font-bold">{username}</span>
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${username}@gmail.com`} alt={username} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-grey-nav border-white/60">
          <DropdownMenuLabel>{username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='font-light hover:bg-grey-box'
            onClick={() => navigate('/profile')}
          >Profile</DropdownMenuItem>
          <DropdownMenuItem className='font-light hover:bg-grey-box'>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='hover:bg-grey-box' onClick={onClick}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
