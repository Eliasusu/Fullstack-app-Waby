import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar";
import { ProfileForm } from "./components/ProfileForm";

/** Perfil con el mismo marco que las demás pantallas protegidas: Header arriba y NavBar abajo (nota 67). */
export default function Profile() {
  return (
    <>
      <Header />
      <div className="pb-24">
        <ProfileForm />
      </div>
      <NavBar />
    </>
  );
}
