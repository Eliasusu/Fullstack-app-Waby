import NavBar from "@/components/NavBar";
import { useExercise } from "@/context/ExerciseContext.tsx";
import { useEffect } from "react";
import Header from "@/components/header.tsx";
import MuscleGroups from "./components/MuscleGroups.tsx";


export default function CreatePage() { 
    const { exercises, getExercises } = useExercise();
    // const { muscleGroups, getMuscleGroups } = useMuscleGroup();


  useEffect(() => {
      getExercises();
  }, [getExercises]);
    
    console.log(exercises);


    return (
        <>
            <Header />
            <MuscleGroups />
            <NavBar />
        </>
    )
}