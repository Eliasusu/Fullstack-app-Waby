import { useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm.tsx";
import { useAuth } from "@/users/auth.context.tsx";


export default function Profile() {
    const { user, getOneProfile, isAuthenticated } = useAuth();
    
    useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user?.idUser) {
        try {
          await getOneProfile(user.idUser);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, getOneProfile]);

  if (!user) {
    return <div>Cargando datos del usuario...</div>;
  }
console.log(user);
    return (
        <>
            <h1>Profile</h1>
            <ProfileForm />
        </>
    );
}