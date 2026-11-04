/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Edit, X } from "lucide-react";
import { goalTargetTypesFor, type Exercise, type Goal, type GoalTargetType } from "@waby/shared";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useExercise } from "@/exercises/exercise.context.tsx";
import { useGoals } from "@/goals/goal.context.tsx";
import { formatDay, toDateOnly } from "@/lib/dates.ts";
import { goalTargetTypeLabels, goalTargetUnit } from "@/lib/labels.ts";
import { notifyErrors, notifyResult } from "@/lib/notify.ts";

type GoalDraft = {
    exerciseId?: number;
    targetType?: GoalTargetType;
    targetValue: string;
    startDate: string;
    endDate: string;
};

const emptyDraft = (): GoalDraft => ({ targetValue: '', startDate: toDateOnly(new Date()), endDate: '' });

const formatValue = (value: number | null, type: GoalTargetType) => (value == null ? '—' : `${value} ${goalTargetUnit[type]}`);

/** Formulario de Meta: el tipo de objetivo se elige entre los que admite el ejercicio. */
function GoalForm({ draft, setDraft, exercises, lockExercise }: {
    draft: GoalDraft;
    setDraft: (draft: GoalDraft) => void;
    exercises: Exercise[];
    lockExercise?: boolean;
}) {
    const exercise = exercises.find((e) => e.id === draft.exerciseId);
    const targetTypes = exercise ? goalTargetTypesFor(exercise.metricType) : [];

    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Exercise</Label>
                <div className="col-span-3">
                    <Select
                        disabled={lockExercise}
                        value={draft.exerciseId?.toString()}
                        onValueChange={(value) => {
                            const selected = exercises.find((e) => e.id === Number(value));
                            const types = selected ? goalTargetTypesFor(selected.metricType) : [];
                            setDraft({ ...draft, exerciseId: Number(value), targetType: types.length === 1 ? types[0] : undefined });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an exercise" />
                        </SelectTrigger>
                        <SelectContent>
                            {exercises.map((e) => (
                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                    <Select
                        disabled={!exercise}
                        value={draft.targetType}
                        onValueChange={(value) => setDraft({ ...draft, targetType: value as GoalTargetType })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a goal type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {targetTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{goalTargetTypeLabels[type]}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetValue" className="text-right">Goal</Label>
                <Input id="targetValue" type="number" step="0.5" className="col-span-3" value={draft.targetValue}
                    onChange={(e) => setDraft({ ...draft, targetValue: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">From</Label>
                <Input id="startDate" type="date" className="col-span-3" value={draft.startDate}
                    onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">To</Label>
                <Input id="endDate" type="date" className="col-span-3" value={draft.endDate}
                    onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
            </div>
        </>
    );
}

const toPayload = (draft: GoalDraft) => ({
    exerciseId: draft.exerciseId,
    targetType: draft.targetType,
    targetValue: draft.targetValue === '' ? undefined : Number(draft.targetValue),
    startDate: draft.startDate,
    ...(draft.endDate ? { endDate: draft.endDate } : {}),
});

export default function GoalsTable() {
    const { goals, getAll, create, update, remove } = useGoals();
    const { allExercises, getAllExercises } = useExercise();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState<GoalDraft>(emptyDraft());
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [editDraft, setEditDraft] = useState<GoalDraft>(emptyDraft());

    useEffect(() => {
        getAll();
        getAllExercises();
    }, []);

    const handleDelete = async (goal: Goal) => {
        if (!window.confirm(`Are you sure you want to delete the goal for ${goal.exercise.name}?`)) return;
        notifyResult(await remove(goal.id), { title: "Goal deleted" });
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Si falta algo, la API responde 400 con los campos y se muestran en el toast.
        const result = await create(toPayload(newGoal) as Parameters<typeof create>[0]);
        if (notifyResult(result, { title: "Goal created" })) {
            setNewGoal(emptyDraft());
            setIsAddDialogOpen(false);
        }
    };

    const startEditing = (goal: Goal) => {
        setEditingGoal(goal);
        setEditDraft({
            exerciseId: goal.exercise.id,
            targetType: goal.targetType,
            targetValue: String(goal.targetValue),
            startDate: goal.startDate,
            endDate: goal.endDate ?? '',
        });
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingGoal) return;
        // El ejercicio de una Meta no se cambia desde acá: se manda el resto.
        const { targetType, targetValue, startDate, endDate } = toPayload(editDraft);
        const data = { targetType, targetValue, startDate, ...(endDate ? { endDate } : {}) };
        if (data.targetValue === undefined) {
            notifyErrors(['El objetivo es obligatorio']);
            return;
        }
        if (notifyResult(await update(editingGoal.id, data), { title: "Goal updated" })) {
            setEditingGoal(null);
        }
    };

    return (
        <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-medium mb-5">Goals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border border-white/30 rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Exercise</TableHead>
                                <TableHead className="text-center">Current</TableHead>
                                <TableHead className="text-center">Goal</TableHead>
                                <TableHead className="text-center">Dates</TableHead>
                                <TableHead className="text-center">Delete</TableHead>
                                <TableHead className="text-center">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals.map((goal) => (
                                <TableRow key={goal.id} className={goal.achieved ? 'text-green-400' : ''}>
                                    <TableCell>{goal.exercise.name}</TableCell>
                                    <TableCell className="text-center">{formatValue(goal.currentValue, goal.targetType)}</TableCell>
                                    <TableCell className="text-center">{formatValue(goal.targetValue, goal.targetType)}</TableCell>
                                    <TableCell className="text-center text-xs">
                                        {formatDay(goal.startDate)}{goal.endDate ? ` – ${formatDay(goal.endDate)}` : ''}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(goal)} className="h-8 w-8 p-0">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="icon" className="h-8 w-8 p-0" onClick={() => startEditing(goal)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Dialog open={editingGoal !== null} onOpenChange={(open) => !open && setEditingGoal(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit goal</DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4 py-4" onSubmit={handleUpdate}>
                            <GoalForm draft={editDraft} setDraft={setEditDraft} exercises={allExercises} lockExercise />
                            <Button type="submit">Update goal</Button>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full text-gray-100 bg-primary hover:text-gray-200 hover:bg-redHover mt-4"
                        >
                            Add new goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New goal</DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4 py-4" onSubmit={handleCreate}>
                            <GoalForm draft={newGoal} setDraft={setNewGoal} exercises={allExercises} />
                            <Button type="submit">Create goal</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </BoxContainer>
    );
}
