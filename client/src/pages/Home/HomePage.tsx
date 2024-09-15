import DayRoutine from "@/components/dayRoutine.tsx";
import Header from "@/components/header.tsx";
import NavBar from "@/components/NavBar.tsx";
import Activity from "@/components/activity.tsx";
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