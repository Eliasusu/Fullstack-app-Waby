import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface Exercise {
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

  return (
      <DataTable columns={columns as ColumnDef<Exercise, unknown>[]} data={data} />
  )
}
