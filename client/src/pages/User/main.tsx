/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { useAuth } from "@/users/auth.context.tsx";

export default function Profile() {
  const { user, getOneProfile } = useAuth();

  console.log('user', user)


  useEffect(() => {
    console.log('entro al useEffect')
    getOneProfile(user?.id || '')
  }, [])

  return (
    <>
      <ProfileForm />
    </>
  );
}
