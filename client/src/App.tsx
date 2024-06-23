import NavBar from './components/NavBar.tsx';
import Welcome  from './pages/Welcome/index.tsx';

export function App() {
  return(

    <div className="flex flex-col h-screen">
      <Welcome />
      <NavBar />
    </div>
 
  )
}