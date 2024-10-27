import { useEffect, useState } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { useAuth } from "@/users/auth.context";
import NavBar from "@/components/NavBar.tsx";
import Header from "@/components/Header.tsx";


export default function Profile() {
  const { user, getOneProfile, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user?.idUser) {
        try {
          await getOneProfile(user.idUser); // Obtener datos completos
          setLoading(false); 
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user?.idUser, getOneProfile]);

  if (loading) {
    return <div>Cargando datos del usuario...</div>;
  }

  if (!user) {
    return <div>Error: No se pudo cargar el perfil del usuario.</div>;
  }

  
  return (
    <>
      <Header />
      <NavBar/>
      <ProfileForm />
    </>
  );
}
