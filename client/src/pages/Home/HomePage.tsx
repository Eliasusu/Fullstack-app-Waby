import DayRoutine from "@/components/ui/dayRoutine.tsx";
import Header from "@/components/ui/header.tsx";
import NavBar from "@/components/ui/navbar.tsx";
import Activity from "@/components/ui/activity.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";

export default function Index() {

    

    return (
        <>
        <Header />
        <Activity />
        <DayRoutine />
        <Calendar />
        <NavBar /> 
        </>
    );
}