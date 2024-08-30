import DayRoutine from "@/components/ui/dayRoutine.tsx";
import Header from "../../components/ui/Header.tsx";
import NavBar from "../../components/ui/NavBar.tsx";
import Activity from "../../components/ui/activity.tsx";
import { Calendar } from "../../components/ui/calendar.tsx";

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