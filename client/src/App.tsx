
import Welcome from './pages/Welcome/index.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Welcome/register.tsx';

export function App() {
  return (
    <BrowserRouter>

      <div className="flex flex-col h-screen">
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/login' element={<Welcome />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<h1>Dashboard</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}