import { ColumnDef } from "@tanstack/react-table"

export type Exercise = {
    name: string,
    description: string,
    muscleGroups: [string],
    difficulty: string,
    typeExercise: string,
}


export const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "muscleGroups",
    header: "Muscle Groups",
  },
  { 
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "typeExercise",
    header: "Type Exercise",
  },
    
]
