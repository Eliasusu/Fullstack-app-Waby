import { DayRoutine } from "@/components/DayRoutine.tsx";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import Activity from "@/components/Activity.tsx";
import { CalendarHome } from "./components/Calendar.tsx";


export default function Index() {

    //En la pagina Home, siempre se mostrará el training del día actual
    const date = new Date();

    return (
        <>

            <Header />
            <Activity />
            <DayRoutine date={date} />
            <CalendarHome />
            <NavBar />
        </>
    );
}