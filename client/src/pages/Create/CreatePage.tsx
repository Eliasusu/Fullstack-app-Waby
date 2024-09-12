import NavBar from "@/components/ui/NavBar.tsx";
import { useExercise } from "@/context/ExerciseContext.tsx";
import { useEffect } from "react";


export default function CreatePage() { 

    const { exercises, getExercises } = useExercise();

  useEffect(() => {
      const res = getExercises();
      console.log(res)
      
  }, [getExercises] );


    return (
        <>
            <NavBar />  
        </>
    )
}