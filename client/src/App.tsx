import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Welcome/RegisterPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import Index from './pages/Home/HomePage.tsx';
import LoginPage from './pages/Welcome/LoginPage.tsx';
import Welcome from './pages/Welcome/Welcome.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import CreatePage from './pages/Create/CreatePage.tsx';
import { ExerciseProvider } from './context/ExerciseContext.tsx';
import { TrainingProvider } from './context/TrainingContext.tsx';

export function App() {
  return (
    <AuthProvider>
      <TrainingProvider>
      <ExerciseProvider>
        <BrowserRouter>
        <div className="flex flex-col h-full">
          <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<Index />} />
              <Route path='/calendar' element={<Index />} />
              <Route path='/create' element={<CreatePage />} />
            </Route>
          </Routes>
        </div>
        </BrowserRouter>
        </ExerciseProvider>
        </TrainingProvider>
    </AuthProvider>
  );
}