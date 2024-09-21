import { DayRoutine } from "@/components/DayRoutine.tsx";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import { CalendarHome } from "@/pages/Home/components/Calendar.tsx";
export default function CronogramPage() {


    return (
        <>

            <Header />
             <CalendarHome />
            <DayRoutine />
           
        <NavBar /> 
        </>
    );
}