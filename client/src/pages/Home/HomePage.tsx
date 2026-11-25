import { DayRoutine } from "@/components/DayRoutine.tsx";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import Activity from "@/components/Activity.tsx";


export default function Index() {

    //En la pagina Home, siempre se mostrará el training del día actual
    const date = new Date();

    return (
        <>
            <Header />
            {/*
              Mobile-first (nota 75): una columna en celular, SM y MD. En LG, grilla de 2 columnas:
              el Entrenamiento del día y la Actividad, cada uno a lo ancho (el calendario se sacó en #68).
              pb-24 deja lugar para la NavBar fija.
            */}
            <main className="pb-24 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-2 lg:items-start lg:gap-x-6 lg:px-6">
                <div className="lg:col-span-2">
                    <DayRoutine date={date} />
                </div>
                <div className="lg:col-span-2">
                    <Activity />
                </div>
            </main>
            <NavBar />
        </>
    );
}
