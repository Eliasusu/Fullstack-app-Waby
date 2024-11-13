/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Edit, Check } from 'lucide-react'
import { useEffect, useState } from "react"
import { Exercise } from "@/exercises/exercise.type.ts"

const difficultyLevels = ["Easy", "Medium", "Hard"];
const typeExercise = ["Push", "Pull", "Legs", "Isometric"];

export const columns = ({ removeExercise, editarExercise, editingId, setEditingId, editedExercise, setEditedExercise }: {
  removeExercise: (idExercise: number) => void,
  editarExercise: (exercise: Exercise) => void,
  editingId: number | null,
  setEditingId: (id: number | null) => void
  editedExercise: Exercise | null,
  setEditedExercise: (exercise: Exercise | null) => void
}): ColumnDef<Exercise>[] => {

  const handleInputChange = (key: keyof Exercise, value: string | number[]) => {
    if (editedExercise) {
      setEditedExercise({ ...editedExercise, [key]: value } as Exercise);
    }
  };

  const createEditableCell = (key: keyof Exercise, type: 'text' | 'select' = 'text', options?: string[]) => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }: { row: { original: Exercise } }) => {
      const exercise = row.original;
      const isEditing = editingId === exercise.idExercise;
      const value = isEditing && editedExercise ? editedExercise[key] : exercise[key];
      const [localValue, setLocalValue] = useState<string | number[]>(value as string | number[]);

      useEffect(() => {
        setLocalValue(value as string | number[]);
      }, [value]);

      const handleConfirmEdit = () => {
        if (editedExercise) {
          setEditedExercise({ ...editedExercise, [key]: localValue });
          editarExercise(editedExercise);
        }
      };

      if (isEditing && key !== 'idExercise') {
        if (type === 'select' && options) {
          return (
            <Select
              value={localValue as string}
              onValueChange={(newValue) => {
                setLocalValue(newValue);
                handleInputChange(key, newValue);
              }}
            >
              <SelectTrigger className="bg-grey-box border-gray-600">
                <SelectValue placeholder={`Select ${key}`} />
              </SelectTrigger>
              <SelectContent className="bg-grey-boxRoutine">
                {options.map((option) => (
                  <SelectItem key={option} className="text-white" value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <Input
            value={localValue as string}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleConfirmEdit}
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
        return exercise.muscleGroups.join(', ');
      },
    },
    createEditableCell('difficulty', 'select', difficultyLevels),
    createEditableCell('typeExercise', 'select', typeExercise),
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
                  setEditedExercise({ ...exercise } as Exercise);
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
