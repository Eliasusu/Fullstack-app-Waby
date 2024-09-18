import { DayRoutine } from "@/components/DayRoutine.tsx";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import Activity from "@/components/Activity.tsx";
import { CalendarHome } from "./components/Calendar.tsx";
export default function Index() {


    return (
        <>

        <Header />
        <Activity />
            <DayRoutine />
            <CalendarHome />
        <NavBar /> 
        </>
    );
}