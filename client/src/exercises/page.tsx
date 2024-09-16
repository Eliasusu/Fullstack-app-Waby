
import { columns } from "./columns"
import { DataTable } from "./data-table"


interface Props {
  data: Array<{
    name: string,
    description: string,
    muscleGroups: [string],
    difficulty: string,
    typeExercise: string
  }>
}

export default function ExercisesTable({data}: Props) {

  return (
      <DataTable columns={columns} data={data} />
  )
}
