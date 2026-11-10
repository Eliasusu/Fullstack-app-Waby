import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { useState } from 'react'
import type { Exercise } from "@waby/shared"
import { notifyResult } from "@/lib/notify.ts"

interface Props {
  data: Exercise[]
}

export default function ExercisesTable({ data }: Props) {
  const { removeExercise, editarExercise } = useExercise();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);

  const saveExercise = async (exercise: Exercise) => {
    const result = await editarExercise(exercise.id, {
      name: exercise.name,
      ...(exercise.description ? { description: exercise.description } : {}),
      difficulty: exercise.difficulty,
      movementPattern: exercise.movementPattern,
      metricType: exercise.metricType,
    });
    notifyResult(result, { title: "Exercise updated" });
  };

  const deleteExercise = async (exercise: Exercise) => {
    notifyResult(await removeExercise(exercise.id), { title: "Exercise deleted", description: `${exercise.name} was deleted.` });
  };

  const exerciseColumns = columns({ removeExercise: deleteExercise, saveExercise, editingId, setEditingId, editedExercise, setEditedExercise });
  return (
    <DataTable columns={exerciseColumns} data={data} />
  )
}
