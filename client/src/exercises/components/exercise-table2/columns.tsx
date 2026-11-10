import { ColumnDef } from "@tanstack/react-table"
import type { Exercise } from "@waby/shared"
import { difficultyLabels, metricTypeLabels, movementPatternLabels } from "@/lib/labels.ts"

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
    cell: ({ row }) => row.original.muscleGroups.map((group) => group.name).join(', '),
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => difficultyLabels[row.original.difficulty],
  },
  {
    accessorKey: "movementPattern",
    header: "Pattern",
    cell: ({ row }) => movementPatternLabels[row.original.movementPattern],
  },
  {
    accessorKey: "metricType",
    header: "Measured by",
    cell: ({ row }) => metricTypeLabels[row.original.metricType],
  },
]
