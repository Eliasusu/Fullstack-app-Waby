import NavBar from "@/components/NavBar";
import { useExercise } from "@/context/ExerciseContext.tsx";
import { useEffect } from "react";
import Header from "@/components/Header.tsx";
import MuscleGroups from "./components/MuscleGroups.tsx";


export default function CreatePage() { 
    const { exercises, getExercises } = useExercise();
    useEffect(() => {
        getExercises();
    }, [getExercises]);

    console.log(exercises);

    return (
        <>
            <Header />
            <MuscleGroups exercises={exercises}/>
            <NavBar />
        </>
    )
}