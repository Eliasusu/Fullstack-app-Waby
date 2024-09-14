import DayRoutine from "@/components/ui/dayRoutine.tsx";
import Header from "@/components/ui/header.tsx";
import NavBar from "@/components/ui/NavBar.tsx";
import Activity from "@/components/ui/activity.tsx";
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