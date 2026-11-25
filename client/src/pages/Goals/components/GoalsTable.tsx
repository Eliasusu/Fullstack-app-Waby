/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Edit, X } from "lucide-react";
import { CreateGoalSchema, UpdateGoalSchema, goalTargetTypesFor, type Exercise, type Goal, type GoalTargetType, type Mesocycle } from "@waby/shared";
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
import { useMesocycles } from "@/mesocycles/mesocycle.context.tsx";
import { goalTargetTypeLabels, goalTargetUnit } from "@/lib/labels.ts";
import { notifyResult } from "@/lib/notify.ts";
import { validate, type FieldErrors } from "@/lib/validation.ts";
import FieldError from "@/components/FieldError.tsx";
import { boxWidth } from "@/lib/layout.ts"

type GoalDraft = {
    exerciseId?: number;
    mesocycleId?: number;
    targetType?: GoalTargetType;
    targetValue: string;
};

const emptyDraft = (): GoalDraft => ({ targetValue: '' });

const formatValue = (value: number | null, type: GoalTargetType) => (value == null ? '—' : `${value} ${goalTargetUnit[type]}`);

/**
 * Formulario de Meta: el tipo de objetivo se elige entre los que admite el ejercicio, y la Meta
 * pertenece a un Mesociclo, que es de donde sale su progreso (ADR-0004).
 */
function GoalForm({ draft, setDraft, exercises, mesocycles, lockExercise, errors }: {
    draft: GoalDraft;
    setDraft: Dispatch<SetStateAction<GoalDraft>>;
    exercises: Exercise[];
    mesocycles: Mesocycle[];
    lockExercise?: boolean;
    /** Errores por campo (nota 66). */
    errors: FieldErrors;
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
                        value={draft.exerciseId?.toString() ?? ""}
                        onValueChange={(value) => {
                            const selected = exercises.find((e) => e.id === Number(value));
                            const types = selected ? goalTargetTypesFor(selected.metricType) : [];
                            setDraft((prev) => ({ ...prev, exerciseId: Number(value), targetType: types.length === 1 ? types[0] : undefined }));
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
                <div className="col-span-3 col-start-2 -mt-3"><FieldError message={errors.exerciseId} /></div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Type</Label>
                <div className="col-span-3">
                    <Select
                        disabled={!exercise}
                        value={draft.targetType ?? ""}
                        onValueChange={(value) => setDraft((prev) => ({ ...prev, targetType: value as GoalTargetType }))}
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
                <div className="col-span-3 col-start-2 -mt-3"><FieldError message={errors.targetType} /></div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetValue" className="text-right">Goal</Label>
                <Input id="targetValue" type="number" step="0.5" className="col-span-3" value={draft.targetValue}
                    onChange={(e) => { const targetValue = e.target.value; setDraft((prev) => ({ ...prev, targetValue })); }} />
                <div className="col-span-3 col-start-2 -mt-3"><FieldError message={errors.targetValue} /></div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Mesocycle</Label>
                <div className="col-span-3">
                    <Select
                        value={draft.mesocycleId?.toString() ?? ""}
                        onValueChange={(value) => setDraft((prev) => ({ ...prev, mesocycleId: Number(value) }))}
                    >
                        <SelectTrigger aria-label="Mesocycle">
                            <SelectValue placeholder={mesocycles.length ? "Select a mesocycle" : "Create a mesocycle first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {mesocycles.map((m) => (
                                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-3 col-start-2 -mt-3"><FieldError message={errors.mesocycleId} /></div>
            </div>
        </>
    );
}

const toPayload = (draft: GoalDraft) => ({
    exerciseId: draft.exerciseId,
    mesocycleId: draft.mesocycleId,
    targetType: draft.targetType,
    targetValue: draft.targetValue === '' ? undefined : Number(draft.targetValue),
});

export default function GoalsTable() {
    const { goals, loading, getAll, create, update, remove } = useGoals();
    const { allExercises, getAllExercises } = useExercise();
    const { mesocycles, getMesocycles } = useMesocycles();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState<GoalDraft>(emptyDraft());
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [editDraft, setEditDraft] = useState<GoalDraft>(emptyDraft());
    const [createErrors, setCreateErrors] = useState<FieldErrors>({});
    const [editErrors, setEditErrors] = useState<FieldErrors>({});

    useEffect(() => {
        getAll();
        getAllExercises();
        getMesocycles();
    }, []);

    const handleDelete = async (goal: Goal) => {
        if (!window.confirm(`Are you sure you want to delete the goal for ${goal.exercise.name}?`)) return;
        notifyResult(await remove(goal.id), { title: "Goal deleted" });
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Se valida con el esquema de la API antes de enviar (nota 66).
        const validation = validate(CreateGoalSchema, toPayload(newGoal));
        setCreateErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        if (notifyResult(await create(validation.data), { title: "Goal created" })) {
            setNewGoal(emptyDraft());
            setIsAddDialogOpen(false);
        }
    };

    const startEditing = (goal: Goal) => {
        setEditingGoal(goal);
        setEditErrors({});
        setEditDraft({
            exerciseId: goal.exercise.id,
            mesocycleId: goal.mesocycle?.id,
            targetType: goal.targetType,
            targetValue: String(goal.targetValue),
        });
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingGoal) return;
        // El ejercicio de una Meta no se cambia desde acá: se manda el resto.
        // Si la Meta quedó sin Mesociclo (se borró) y no se elige otro, no se manda.
        const { mesocycleId, targetType, targetValue } = toPayload(editDraft);
        const validation = validate(UpdateGoalSchema, { targetType, targetValue, ...(mesocycleId ? { mesocycleId } : {}) });
        const errors: FieldErrors = validation.ok ? {} : validation.errors;
        // UpdateGoalSchema es parcial: el objetivo se exige acá para no mandar una Meta sin valor.
        if (targetValue === undefined) errors.targetValue = 'Este campo es obligatorio';
        setEditErrors(errors);
        if (!validation.ok || Object.keys(errors).length > 0) return;
        if (notifyResult(await update(editingGoal.id, validation.data), { title: "Goal updated" })) {
            setEditingGoal(null);
        }
    };

    return (
        <BoxContainer width={boxWidth} height="" padding="my-5">
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
                                <TableHead className="text-center">Mesocycle</TableHead>
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
                                        {goal.mesocycle?.name ?? <span className="text-white-text/70">Sin Mesociclo</span>}
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
                            {goals.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-16 text-center text-white-text/70">
                                        {loading ? 'Cargando…' : 'Todavía no tenés metas.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Dialog open={editingGoal !== null} onOpenChange={(open) => !open && setEditingGoal(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit goal</DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4 py-4" onSubmit={handleUpdate}>
                            <GoalForm draft={editDraft} setDraft={setEditDraft} exercises={allExercises} mesocycles={mesocycles} lockExercise errors={editErrors} />
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
                            <GoalForm draft={newGoal} setDraft={setNewGoal} exercises={allExercises} mesocycles={mesocycles} errors={createErrors} />
                            <Button type="submit">Create goal</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </BoxContainer>
    );
}
