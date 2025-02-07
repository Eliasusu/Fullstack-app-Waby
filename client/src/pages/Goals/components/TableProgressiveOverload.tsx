/* eslint-disable react-hooks/exhaustive-deps */
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useProgressiveOverload } from "@/progressiveOverload/progressiveOverload.context.tsx";
import { ProgressiveOverload } from "@/progressiveOverload/progressiveOverload.type.ts";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";

const initialPOs: ProgressiveOverload[] = []


export default function TableProgressiveOverload() {
    const { getAll, remove, update, progressiveOverloads } = useProgressiveOverload();
    const [localPOs, setLocalPOs] = useState<ProgressiveOverload[]>(initialPOs)
    const [isEditedPO, setIsEditedPO] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        setLocalPOs(progressiveOverloads)
    }, [progressiveOverloads])


    const handleSubmitDeletePO = (id: number) => {
        if (localPOs) {
            if (id !== undefined) {
                remove(id);
                setLocalPOs({ ...localPOs })
                toast({
                    title: "Progressive Overload deleted",
                    description: "The PO has been deleted successfully.",

                })
            }
        }
    }

    const handleSubmitUpdatePO = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsEditedPO(false)
        if (localPOs) {
            update(localPOs[0]);
            setLocalPOs(localPOs)
        }
    }

    const handleChangeUpdatePO = (po: number, key: keyof ProgressiveOverload, value: string | number) => {
        if (localPOs) {
            setIsEditedPO(true)

            if (key === "name") {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);
                console.log('newPOs', newPOs)
            }
            if (key === "done") {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);
                console.log('newPOs', newPOs)
            }
            if (key === "goal") {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);
                console.log('newPOs', newPOs)
            }
        }
    }


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
                                <TableHead className="text-center">Exercise</TableHead>
                                <TableHead className="text-center">Weight Done</TableHead>
                                <TableHead className="text-center">Reps Done</TableHead>
                                <TableHead className="text-center">Secs Done</TableHead>
                                <TableHead className="text-center">Goal</TableHead>
                                <TableHead className="text-center">Delete</TableHead>
                                <TableHead className="text-center">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localPOs.map((po, index) => (
                                <TableRow key={po.idProgressiveOverload}>
                                    <TableCell>
                                        <Input
                                            type="text"
                                            className="text-center bg-grey-box border-gray-600"
                                            value={po.name}
                                            onChange={(e) => handleChangeUpdatePO(index, "name", e.target.value)}

                                        />
                                    </TableCell>
                                    <TableCell>
                                        {(po.typePO === "Weight") ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.done}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", parseInt(e.target.value, 10))}
                                            />
                                        ) : (
                                            <Input
                                                disabled={true}
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value="-"
                                            />
                                        )

                                        }
                                    </TableCell>
                                    <TableCell>
                                        {(po.typePO === "Reps") ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.done}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", parseInt(e.target.value, 10))}
                                            />
                                        ) : (
                                            <Input
                                                disabled={true}
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value="-"
                                            />
                                        )

                                        }
                                    </TableCell>
                                    <TableCell>
                                        {(po.typePO === "Secs") ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.done}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", parseInt(e.target.value, 10))}
                                            />
                                        ) : (
                                            <Input
                                                disabled={true}
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value="-"
                                            />
                                        )

                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="text-center bg-grey-box border-gray-600"
                                            value={po.goal}
                                            onChange={(e) => handleChangeUpdatePO(index, "goal", parseInt(e.target.value, 10))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                handleSubmitDeletePO(po.idProgressiveOverload);
                                            }}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {isEditedPO ? (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 p-0"
                                                onClick={(e) => handleSubmitUpdatePO(e)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 p-0"
                                                onClick={() => setIsEditedPO(true)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )
                                        }
                                    </TableCell>
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
