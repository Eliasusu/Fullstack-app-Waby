import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useExercise } from "@/exercises/exercise.context.tsx"

interface Exercise {
  idExercise: number,
  name: string,
  description: string,
  muscleGroups: number[],
  difficulty: string,
  typeExercise: string
}

interface Props {
  data: Exercise[]
}

export default function ExercisesTable({data}: Props) {
  const { removeExercise } = useExercise();

  const exerciseColumns = columns({ removeExercise });
  return (
      <DataTable columns={exerciseColumns as ColumnDef<Exercise, unknown>[]} data={data} />
  )
}
