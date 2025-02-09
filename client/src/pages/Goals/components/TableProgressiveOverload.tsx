/* eslint-disable react-hooks/exhaustive-deps */
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useProgressiveOverload } from "@/progressiveOverload/progressiveOverload.context.tsx";
import { ProgressiveOverload } from "@/progressiveOverload/progressiveOverload.type.ts";
import { Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";

const initialPOs: ProgressiveOverload[] = []

const initialPO: ProgressiveOverload = {
    idProgressiveOverload: 0,
    logDate: new Date(),
    name: "",
    typePO: "Weight",
    done: 0,
    goal: 0,
    exercise: '',
    user: ''
}


export default function TableProgressiveOverload() {
    const { getAll, remove, update, create, errors, progressiveOverloads } = useProgressiveOverload();
    const [localPOs, setLocalPOs] = useState<ProgressiveOverload[]>(initialPOs)
    const [isEditedPO, setIsEditedPO] = useState(false)
    const [isAddDialogPO, setIsAddDialogPO] = useState(false)
    const [newPO, setNewPO] = useState<ProgressiveOverload>(initialPO)
    const { toast } = useToast()

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        setLocalPOs(progressiveOverloads)
    }, [progressiveOverloads])

    console.log('Local POs', localPOs)
    console.log('Progressive Overloads', progressiveOverloads)

    const handleSubmitDeletePO = (id: number) => {
        if (window.confirm("Are you sure you want to delete this Progressive Overload?")) {
            console.log('delete')
            if (localPOs) {
                console.log(id)
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
    }


    const handleSubmitUpdatePO = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setIsEditedPO(false)
        if (localPOs) {
            update(localPOs[0]);
            setLocalPOs(localPOs)
            toast({
                title: "Progressive Overload updated",
                description: "The PO has been updated successfully.",
            })
        }
    }

    const handleChangeUpdatePO = (po: number, key: keyof ProgressiveOverload, value: string | number) => {
        console.log('handleChange', po, key, value)
        setIsEditedPO(true)
        if (key === "done") {

            if (localPOs) {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);
            }
        }

        if (key === "goal") {
            if (localPOs) {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);
            }
        }

        if (key === "name") {
            if (localPOs) {
                const newPOs = [...localPOs];
                (newPOs[po][key] as typeof value) = value;
                setLocalPOs(newPOs);

            }
        }
    }


    const handleChangeCreatePO = (key: keyof ProgressiveOverload, value: string | number) => {
        const addPO = { ...newPO, [key]: value }
        setNewPO(addPO)
        console.log('newPO', newPO)
    }

    const handleSubmitCreatePO = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('create')
        if (newPO) {
            console.log(newPO)
            create(newPO)
            toast({
                title: "Progressive Overload created",
                description: "The PO has been created successfully.",
            })
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
                            {progressiveOverloads.map((po, index) => (
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
                                        {po.typePO === "Weight" ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.typePO === "Weight" ? po.done : ""}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", Number(e.target.value))}
                                            />) : (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={""}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {po.typePO === "Reps" ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.typePO === "Reps" ? po.done : ""}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", Number(e.target.value))}
                                            />) : (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={""}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {po.typePO === "Secs" ? (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={po.typePO === "Secs" ? po.done : ""}
                                                onChange={(e) => handleChangeUpdatePO(index, "done", Number(e.target.value))}
                                            />) : (
                                            <Input
                                                type="number"
                                                className="text-center bg-grey-box border-gray-600"
                                                value={""}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="text-center bg-grey-box border-gray-600"
                                            value={po.goal}
                                            onChange={(e) => handleChangeUpdatePO(index, "goal", Number(e.target.value))}
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
                <Dialog open={isAddDialogPO} onOpenChange={(open) => setIsAddDialogPO(open)}>
                    <><DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full text-gray-100 bg-primary hover:text-gray-200 hover:bg-redHover mt-4"
                        >
                            Add new PO
                        </Button>
                    </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Progressive Overload</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <form
                                    className="grid gap-4 py-4"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSubmitCreatePO(e)
                                    }}>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor='name' className="text-right">Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={newPO.name}
                                            onChange={(e) => handleChangeCreatePO("name", e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() =>
                                            toast({
                                                title: "Progressive Overload created",
                                                description: "The PO has been created successfully.",

                                            })}
                                    >Create PO</Button>
                                </form>
                            </div>
                            <DialogTrigger asChild>
                            </DialogTrigger>

                        </DialogContent></>

                </Dialog>

            </CardContent>
        </BoxContainer >
    );
}
