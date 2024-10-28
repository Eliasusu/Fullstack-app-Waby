import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import { TrainingDay } from "@/trainings/components/trainingDay/TraningDay.tsx";


export default function CronogramPage() {


    return (
        <>
        <Header />
        <TrainingDay /> 
        <NavBar /> 
        </>
    );
}