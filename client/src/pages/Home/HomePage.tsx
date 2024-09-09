import DayRoutine from "@/components/ui/dayRoutine.tsx";
import Header from "@/components/ui/Header.tsx";
import NavBar from "@/components/ui/NavBar.tsx";
import Activity from "@/components/ui/activity.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import React from "react";

export default function Index() {

    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
        <>
        <Header />
        <Activity />
        <DayRoutine />
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
                className="" />
        <NavBar /> 
        </>
    );
}