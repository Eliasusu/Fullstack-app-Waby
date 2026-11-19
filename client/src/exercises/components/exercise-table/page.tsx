import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { useState } from 'react'
import { UpdateExerciseSchema, type Exercise } from "@waby/shared"
import { notifyErrors, notifyResult } from "@/lib/notify.ts"
import { errorList, validate } from "@/lib/validation.ts"

const labels = { name: 'Nombre', description: 'Descripción', difficulty: 'Dificultad', movementPattern: 'Patrón', metricType: 'Se mide por' }

interface Props {
  data: Exercise[]
  loading?: boolean
}

export default function ExercisesTable({ data, loading = false }: Props) {
  const { removeExercise, editarExercise } = useExercise();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);

  const saveExercise = async (exercise: Exercise) => {
    // Se valida antes de enviar (nota 66). En la tabla no hay lugar por campo: el error va al toast.
    const validation = validate(UpdateExerciseSchema, {
      name: exercise.name,
      ...(exercise.description ? { description: exercise.description } : {}),
      difficulty: exercise.difficulty,
      movementPattern: exercise.movementPattern,
      metricType: exercise.metricType,
    });
    if (!validation.ok) {
      notifyErrors(errorList(validation.errors, labels));
      return;
    }
    notifyResult(await editarExercise(exercise.id, validation.data), { title: "Exercise updated" });
  };

  const deleteExercise = async (exercise: Exercise) => {
    notifyResult(await removeExercise(exercise.id), { title: "Exercise deleted", description: `${exercise.name} was deleted.` });
  };

  const exerciseColumns = columns({ removeExercise: deleteExercise, saveExercise, editingId, setEditingId, editedExercise, setEditedExercise });
  return (
    <DataTable columns={exerciseColumns} data={data} loading={loading} />
  )
}
