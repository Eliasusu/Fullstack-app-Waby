import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";


export default function TableProgressiveOverload() {




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
                                <TableHead>Goal</TableHead>
                                <TableHead>Current</TableHead>
                                <TableHead>Unit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                // Aquí va el map de los progressiveOverload del usuario
                            }
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