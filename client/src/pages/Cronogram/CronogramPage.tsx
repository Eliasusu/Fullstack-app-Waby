import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import { TrainingDay } from "@/trainings/components/trainingDay/TraningDay.tsx";


export default function CronogramPage() {


    return (
        <>
            <Header />
            {/* pb-24 deja lugar para la NavBar fija (nota 75). */}
            <main className="pb-24">
                <TrainingDay />
            </main>
            <NavBar />
        </>
    );
}