import NavBar from "@/components/NavBar";
import Header from "@/components/Header.tsx";
import GoalsTable from "./components/GoalsTable.tsx";

export default function GoalsPage() {
    return (
        <>
            <Header />
            {/* pb-24 deja lugar para la NavBar fija (nota 75). */}
            <main className="pb-24">
                <GoalsTable />
            </main>
            <NavBar />
        </>
    )
}
