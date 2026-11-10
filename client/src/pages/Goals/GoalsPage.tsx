import NavBar from "@/components/NavBar";
import Header from "@/components/Header.tsx";
import GoalsTable from "./components/GoalsTable.tsx";

export default function GoalsPage() {
    return (
        <>
            <Header />
            <GoalsTable />
            <NavBar />
        </>
    )
}
