/* eslint-disable react-hooks/exhaustive-deps */
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useExercise } from "@/exercises/exercise.context.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { useProgressiveOverload } from "@/progressiveOverload/progressiveOverload.context.tsx";
import { ProgressiveOverload } from "@/progressiveOverload/progressiveOverload.type.ts";
import { Edit, X } from "lucide-react";
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
    const { exercises, getAllExercises } = useExercise()
    const [localPOs, setLocalPOs] = useState<ProgressiveOverload[]>(initialPOs)
    const [isAddDialogPO, setIsAddDialogPO] = useState(false)
    const [newPO, setNewPO] = useState<ProgressiveOverload>(initialPO)
    const { toast } = useToast()

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        getAllExercises()
    }, []);


    useEffect(() => {
        setLocalPOs(progressiveOverloads)
    }, [progressiveOverloads])


    useEffect(() => {

    }, [errors, toast])

    const handleSubmitDeletePO = (id: number) => {
        if (window.confirm("Are you sure you want to delete this Progressive Overload?")) {
            console.log('delete')
            if (localPOs) {
                console.log(id)
                if (id !== undefined) {
                    remove(id);
                    setLocalPOs(localPOs.filter((po) => po.idProgressiveOverload !== id))
                    toast({
                        title: "Progressive Overload deleted",
                        description: "The PO has been deleted successfully.",
                    })
                }
            }
        }
    }


    const handleSubmitUpdatePO = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (localPOs) {
            try {
                await update(localPOs[0]);
                console.log(errors)
                if (errors) {
                    errors.forEach((error, index) => {
                        setTimeout(() => {
                            toast({
                                title: "Error in " + error.path,
                                description: error.message,
                                variant: "destructive",
                                duration: 1000, // 5 seconds
                            })
                        }, index * 2000) // Delay each toast by 500ms
                    })
                    setLocalPOs(localPOs)
                    return
                } else {
                    setLocalPOs(localPOs)
                    toast({
                        title: "Progressive Overload updated",
                        description: "The PO has been updated successfully.",
                    })
                }
            } catch (error) {
                console.error("Error updating Progressive Overload:", error);
            }

        }
    }

    const handleChangeUpdatePO = (key: keyof ProgressiveOverload, value: string | number) => {
        const addPO = { ...newPO, [key]: value }
        setNewPO(addPO)
    }


    const handleChangeCreatePO = (key: keyof ProgressiveOverload, value: string | number) => {
        const addPO = { ...newPO, [key]: value }
        setNewPO(addPO)
        console.log('newPO', newPO)
    }

    const handleSubmitCreatePO = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newPO) {
            await create(newPO)
            if (errors) {
                errors.forEach((error, index) => {
                    setTimeout(() => {
                        toast({
                            title: "Error in " + error.path,
                            description: error.message,
                            variant: "destructive",
                            duration: 1000, // 5 seconds
                        })
                    }, index * 2000) // Delay each toast by 500ms
                })
                setIsAddDialogPO(false)
                return
            } else {
                getAll()
                toast({
                    title: "Progressive Overload created",
                    description: "The PO has been created successfully.",
                })
                setIsAddDialogPO(false)
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
                                <TableHead className="text-center">Done</TableHead>
                                <TableHead className="text-center">Goal</TableHead>
                                <TableHead className="text-center">Type</TableHead>
                                <TableHead className="text-center">Delete</TableHead>
                                <TableHead className="text-center">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localPOs.map((po, index) => (
                                <TableRow key={po.idProgressiveOverload}>
                                    <TableCell>{po.name}</TableCell>
                                    <TableCell>{po.done}</TableCell>
                                    <TableCell>{po.goal}</TableCell>
                                    <TableCell>{po.typePO}</TableCell>
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
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => {
                                                        setLocalPOs((prev) => {
                                                            const updatedPOs = [...prev]
                                                            updatedPOs[index] = { ...updatedPOs[index] }
                                                            return updatedPOs
                                                        })
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Progressive Overload</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <form
                                                        className="grid gap-4 py-4"
                                                        onSubmit={(e) => {
                                                            e.preventDefault()
                                                            handleSubmitUpdatePO(e)
                                                        }}>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor='name' className="text-right">Name</Label>

                                                            <Input
                                                                type="text"
                                                                id="name"
                                                                value={po.name}
                                                                onChange={(e) => handleChangeUpdatePO("name", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor='weight' className="text-right">Done</Label>

                                                            <Input
                                                                type="text"
                                                                id="weight"
                                                                value={po.done}
                                                                onChange={(e) => handleChangeUpdatePO("done", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor='goal' className="text-right">Goal</Label>

                                                            <Input
                                                                type="text"
                                                                id="goal"
                                                                value={po.goal}
                                                                onChange={(e) => handleChangeUpdatePO("goal", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor='type' className="text-right">Type</Label>

                                                            <Input
                                                                type="text"
                                                                id="type"
                                                                value={po.typePO}
                                                                onChange={(e) => handleChangeUpdatePO("typePO", e.target.value)}
                                                            />
                                                        </div>
                                                        <Button type="submit">Update PO</Button>
                                                    </form>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor='typePO' className="text-right">Type</Label>
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a type of OP" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="weight">Weight</SelectItem>
                                                    <SelectItem value="reps">Reps</SelectItem>
                                                    <SelectItem value="secs">Secs</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor='done' className="text-right">Done</Label>
                                        <Input
                                            type="number"
                                            id="done"
                                            value={newPO.done}
                                            onChange={(e) => handleChangeCreatePO("done", parseInt(e.target.value, 10))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor='goal' className="text-right">Goal</Label>
                                        <Input
                                            type="number"
                                            id="goal"
                                            value={newPO.goal}
                                            onChange={(e) => handleChangeCreatePO("goal", parseInt(e.target.value, 10))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor='exercise' className="text-right">Exercise</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                const selectedExercise = exercises.find(ex => ex.name.toString() === value)
                                                if (selectedExercise) {
                                                    handleChangeCreatePO('exercise', selectedExercise.name)
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder='Select a exercise' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {exercises.map((exercise) => (
                                                    <SelectItem
                                                        key={exercise.idExercise}
                                                        value={exercise.name}
                                                    >
                                                        {exercise.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit">Create PO</Button>
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
