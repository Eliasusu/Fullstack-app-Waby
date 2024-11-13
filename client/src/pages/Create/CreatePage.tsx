import NavBar from "@/components/NavBar";
import Header from "@/components/Header.tsx";
import MuscleGroups from "./components/MuscleGroups.tsx";
import ExercisesTable2 from "@/exercises/components/exercise-table2/page.tsx";
import { useExercise } from "@/exercises/exercise.context.tsx";
import { useEffect } from "react";



export default function CreatePage() {
    const { getAllExercises } = useExercise()

    useEffect(() => {
        getAllExercises()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Header />
            <MuscleGroups />
            <ExercisesTable2 />
            <NavBar />
        </>
    )
}