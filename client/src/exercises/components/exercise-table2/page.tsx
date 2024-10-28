/* eslint-disable react-hooks/exhaustive-deps */
import { useExercise } from "@/exercises/exercise.context.tsx"
import { DataTableExercises } from "@/lib/data-table-allExercises.tsx"
import { columns } from "./columns.tsx"
import BoxConteiner from "@/components/ui/BoxConteiner.tsx"
import { useEffect } from "react"

type data = {
  name: string,
  description: string,
  muscleGroups: string[],
  difficulty: string,
  typeExercise: string,
}

let data: data[] = []

export default function ExercisesTable2() {
  const { allExercises, getAllExercises } = useExercise()


  useEffect(() => {
    getAllExercises()
  }, [])

  data = allExercises.map((exercise) => {
    return {
      name: exercise.name,
      description: exercise.description,
      muscleGroups: exercise.muscleGroups.map((idMuscleGroup) => idMuscleGroup.nameMuscleGroup),
      difficulty: exercise.difficulty,
      typeExercise: exercise.typeExercise,
    }
  })

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="p-5" padding="my-5">
      <h2 className="text-2xl font-medium mb-4 text-gray-100">Tus ejercicios</h2>
      <DataTableExercises columns={columns} data={data} />
    </BoxConteiner>
  )
}
