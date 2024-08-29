import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Welcome/RegisterPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import Index from './pages/Home/HomePage.tsx';
import LoginPage from './pages/Welcome/LoginPage.tsx';
import Welcome from './pages/Welcome/Welcome.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<Register />} />
            <Route element={<ProtectedRoute/>}>
              <Route path='/home' element={<Index />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}