
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { X, Edit, Check } from 'lucide-react'

export type Exercise = {
    idExercise: number,
    name: string,
    description: string,
    muscleGroups: number[],
    difficulty: string,
    typeExercise: string,
    trainingMethod: string
}

export const columns = ({ removeExercise, editarExercise, editingId, setEditingId, editedExercise, setEditedExercise}: { 
  removeExercise: (idExercise: number) => void, 
  editarExercise: (exercise: Exercise) => void,
  editingId: number | null,
  setEditingId: (id: number | null) => void
  editedExercise: Exercise | null,
  setEditedExercise: (exercise: Exercise | null) => void
}): ColumnDef<Exercise>[] => {
 

  const handleInputChange = (key: keyof Exercise, value: string | number[]) => {
    if (editedExercise) {
      setEditedExercise({ ...editedExercise, [key]: value });
    }
  };

  const createEditableCell = (key: keyof Exercise, type: 'text' | 'select' = 'text') => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }: { row: { original: Exercise } }) => {
      const exercise = row.original;
      const isEditing = editingId === exercise.idExercise;
      const value = isEditing && editedExercise ? editedExercise[key] : exercise[key];

      if (isEditing && key !== 'idExercise') {
        if (type === 'select') {
          return (
            <Select
              value={value as string}
              onValueChange={(newValue) => handleInputChange(key, newValue)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          );
        }
        return (
          <Input
            value={value as string}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        );
      }
      return value;
    },
  });

  return [
    createEditableCell('idExercise'),
    createEditableCell('name'),
    createEditableCell('description'),
    {
      accessorKey: 'muscleGroups',
      header: 'Muscle Groups',
      cell: ({ row }) => {
        const exercise = row.original;
        const isEditing = editingId === exercise.idExercise;
        const value = isEditing && editedExercise ? editedExercise.muscleGroups : exercise.muscleGroups;

        if (isEditing) {
          return (
            <Input
              value={value.join(', ')}
              onChange={(e) => handleInputChange('muscleGroups', e.target.value.split(',').map(Number))}
            />
          );
        }
        return value.join(', ');
      },
    },
    createEditableCell('difficulty', 'select'),
    createEditableCell('typeExercise'),
    {
      id: "actions",
      cell: ({ row }) => {
        const exercise = row.original;
        const isEditing = editingId === exercise.idExercise;

        return (
          <div className="flex space-x-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (editedExercise) {
                    editarExercise(editedExercise);
                  }
                  setEditingId(null);
                  setEditedExercise(null);
                }}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingId(exercise.idExercise);
                  setEditedExercise({ ...exercise });
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
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
          </div>
        );
      },
    },
  ];
}