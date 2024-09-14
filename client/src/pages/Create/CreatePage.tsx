import NavBar from "@/components/ui/NavBar.tsx";
import { useExercise } from "@/context/ExerciseContext.tsx";
import { useEffect } from "react";
import Header from "@/components/ui/header.tsx";


export default function CreatePage() { 

    const { exercises, getExercises } = useExercise();

  useEffect(() => {
      getExercises();
  }, [] );


    return (
        <>
            <Header />
            <NavBar />
        </>
    )
}