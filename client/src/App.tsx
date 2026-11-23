import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from '@/pages/Welcome/RegisterPage.tsx';
import { AuthProvider } from './users/auth.context.tsx';
import Index from '@/pages/Home/HomePage.tsx';
import LoginPage from '@/pages/Welcome/LoginPage.tsx';
import Welcome from '@/pages/Welcome/Welcome.tsx';
import ProtectedRoute from '@/lib/ProtectedRoute.tsx';
import CreatePage from '@/pages/Create/CreatePage.tsx';
import CronogramPage from '@/pages/Cronogram/CronogramPage.tsx';
import { ExerciseProvider } from '@/exercises/exercise.context.tsx';
import { TrainingProvider } from '@/trainings/training.context.tsx';
import { TrainingMethodProvider } from './trainingMethods/training-method.context.tsx';
import { MuscleGroupProvider } from './muscleGroups/muscle-group.context.tsx';
import Profile from './pages/User/main.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import GoalsPage from './pages/Goals/GoalsPage.tsx';
import ErrorPage from './pages/Errors/ErrorPage.tsx';
import { GoalProvider } from './goals/goal.context.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import AdminRoute from './lib/AdminRoute.tsx';
import AdminPage from './pages/Admin/AdminPage.tsx';
import MesocyclesPage from './pages/Mesocycles/MesocyclesPage.tsx';
import { MesocycleProvider } from './mesocycles/mesocycle.context.tsx';

/** Rutas de la app. El ErrorBoundary se reinicia al cambiar de ruta (key = pathname), así un error no queda pegado (nota 82). */
function AppRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Index />} />
          <Route path='/calendar' element={<CronogramPage />} />
          <Route path='/create' element={<CreatePage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/goals' element={<GoalsPage />} />
          <Route path='/mesocycles' element={<MesocyclesPage />} />
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<AdminPage />} />
          </Route>
        </Route>
        <Route path='/error/:code' element={<ErrorPage />} />
        <Route path='*' element={<ErrorPage code={404} />} />
      </Routes>
    </ErrorBoundary>
  );
}

export function App() {
  const methods = useForm();

  return (
    <BrowserRouter>
      <AuthProvider>
        <FormProvider {...methods}>
          <MuscleGroupProvider>
            <TrainingMethodProvider>
              <TrainingProvider>
                <ExerciseProvider>
                  <GoalProvider>
                    <MesocycleProvider>
                      <div className="flex flex-col h-full">
                        <AppRoutes />
                      </div>
                    </MesocycleProvider>
                  </GoalProvider>
                </ExerciseProvider>
              </TrainingProvider>
            </TrainingMethodProvider>
          </MuscleGroupProvider>
        </FormProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}