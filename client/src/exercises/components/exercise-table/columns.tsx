import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react'


export type Exercise = {
    idExercise: number,
    name: string,
    description: string,
    muscleGroups: number[],
    difficulty: string,
    typeExercise: string,
}



export const columns = ({ removeExercise }: { removeExercise: (idExcercise: number) => void }): ColumnDef<Exercise>[] => [
  {
    accessorKey: "idExercise",
    header: "ID",
  },

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

  {
    id: "actions",
    cell: ({ row }) => {
      const exercise = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${exercise.name}?`)) {
              console.log("delete", exercise.idExercise);
              removeExercise(exercise.idExercise);
            }
          }}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      );
    },
  },
]
