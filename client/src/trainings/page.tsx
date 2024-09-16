import { columns } from "./columns"
import { DataTable } from "@/lib/data-table"


interface Props {
  data: Array<{
    trainingName: string,
    trainingType: string,
    day: Date,
    time: string,
    completed: boolean
  }>
}

export default function TrainingTable({ data }: Props) {
  return (
      <DataTable columns={columns} data={data} />
  )
}