import NavBar from "@/components/NavBar";
import Header from "@/components/Header.tsx";
import MuscleGroups from "./components/MuscleGroups.tsx";
import ExercisesTable2 from "@/exercises/components/exercise-table2/page.tsx";



export default function CreatePage() { 

     
    return (
        <>
            <Header />
            <MuscleGroups />
            <ExercisesTable2/>
            <NavBar />
        </>
    )
}