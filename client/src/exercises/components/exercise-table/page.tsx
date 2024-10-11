import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { useState } from 'react'

interface Exercise {
  idExercise: number,
  name: string,
  description: string,
  muscleGroups: number[],
  difficulty: string,
  typeExercise: string
  trainingMethod: string
}

interface Props {
  data: Exercise[]
}

export default function ExercisesTable({data}: Props) {
  const { removeExercise, editarExercise } = useExercise();
  const [editingId, setEditingId] = useState<number | null>(null);
   const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);

  const exerciseColumns = columns({ removeExercise, editarExercise, editingId, setEditingId, editedExercise, setEditedExercise });
  return (
      <DataTable columns={exerciseColumns as ColumnDef<Exercise, unknown>[]} data={data} />
  )
}
