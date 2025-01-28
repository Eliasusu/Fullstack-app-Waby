import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useProgressiveOverload } from "@/progressiveOverload/progressiveOverload.context.tsx";
import { useEffect } from "react";


export default function TableProgressiveOverload() {
    const { getAll, progressiveOverloads } = useProgressiveOverload();

    useEffect(() => {
        getAll();

    }, []);

    console.log("Progressive Overloads", progressiveOverloads);

    return (
        <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium mb-5">Progressive Overload</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border border-white/30 rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exercise</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Reps</TableHead>
                                <TableHead>Secs</TableHead>
                                <TableHead>Goal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {progressiveOverloads.map((po) => (
                                <TableRow key={po.idProgressiveOverload}>
                                    <TableCell>{po.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Button
                    variant="ghost"
                    className="w-full text-gray-100 bg-primary hover:text-gray-200 hover:bg-redHover mt-4"
                >
                    Add new PO
                </Button>
            </CardContent>
        </BoxContainer>
    );
}