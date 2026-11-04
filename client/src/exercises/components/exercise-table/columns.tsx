/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Edit, Check } from 'lucide-react'
import { useEffect, useState } from "react"
import type { Exercise } from "@waby/shared"
import { difficultyLabels, metricTypeLabels, movementPatternLabels, options } from "@/lib/labels.ts"

/** Campos que se editan desde la tabla. Método y grupos musculares se editan en el alta. */
type EditableKey = 'name' | 'description' | 'difficulty' | 'movementPattern' | 'metricType';

const selectOptions: Partial<Record<EditableKey, { value: string; label: string }[]>> = {
  difficulty: options(difficultyLabels),
  movementPattern: options(movementPatternLabels),
  metricType: options(metricTypeLabels),
};

const headers: Record<EditableKey, string> = {
  name: 'Name',
  description: 'Description',
  difficulty: 'Difficulty',
  movementPattern: 'Pattern',
  metricType: 'Measured by',
};

export const columns = ({ removeExercise, saveExercise, editingId, setEditingId, editedExercise, setEditedExercise }: {
  removeExercise: (exercise: Exercise) => void,
  saveExercise: (exercise: Exercise) => void,
  editingId: number | null,
  setEditingId: (id: number | null) => void
  editedExercise: Exercise | null,
  setEditedExercise: (exercise: Exercise | null) => void
}): ColumnDef<Exercise>[] => {

  const createEditableCell = (key: EditableKey): ColumnDef<Exercise> => ({
    accessorKey: key,
    header: headers[key],
    cell: ({ row }) => {
      const exercise = row.original;
      const isEditing = editingId === exercise.id;
      const value = (isEditing && editedExercise ? editedExercise[key] : exercise[key]) ?? '';
      const [localValue, setLocalValue] = useState<string>(value);

      useEffect(() => {
        setLocalValue(value);
      }, [value]);

      const commit = (newValue: string) => {
        if (editedExercise) setEditedExercise({ ...editedExercise, [key]: newValue });
      };

      const choices = selectOptions[key];
      if (isEditing) {
        if (choices) {
          return (
            <Select value={localValue} onValueChange={(newValue) => { setLocalValue(newValue); commit(newValue); }}>
              <SelectTrigger className="bg-grey-box border-gray-600">
                <SelectValue placeholder={headers[key]} />
              </SelectTrigger>
              <SelectContent className="bg-grey-boxRoutine">
                {choices.map((option) => (
                  <SelectItem key={option.value} className="text-white" value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return <Input value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={() => commit(localValue)} />;
      }
      return choices?.find((option) => option.value === value)?.label ?? value;
    },
  });

  return [
    createEditableCell('name'),
    createEditableCell('description'),
    {
      accessorKey: 'muscleGroups',
      header: 'Muscle Groups',
      cell: ({ row }) => row.original.muscleGroups.map((group) => group.name).join(', '),
    },
    createEditableCell('difficulty'),
    createEditableCell('movementPattern'),
    createEditableCell('metricType'),
    {
      id: "actions",
      cell: ({ row }) => {
        const exercise = row.original;
        const isEditing = editingId === exercise.id;

        return (
          <div className="flex space-x-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (editedExercise) saveExercise(editedExercise);
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
                  setEditingId(exercise.id);
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
                  removeExercise(exercise);
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
