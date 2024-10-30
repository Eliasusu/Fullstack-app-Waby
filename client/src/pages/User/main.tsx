/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { useAuth } from "@/users/auth.context.tsx";

export default function Profile() {
  const { user, getOneProfile } = useAuth();

  useEffect(() => {
    getOneProfile(user?.id || '')
  }, [])

  return (
    <>
      <ProfileForm />
    </>
  );
}
