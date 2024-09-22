import { ColumnDef } from "@tanstack/react-table"

export type Training = {
    trainingName: string,
    trainingType: string,
    day: Date,
    time: string,
    completed: boolean
}


export const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "day",
    header: "Day",
  },
  { 
    accessorKey: "time",
    header: "time",
  },
  {
    accessorKey: "completed",
    header: "Completed",
  },
    
]
