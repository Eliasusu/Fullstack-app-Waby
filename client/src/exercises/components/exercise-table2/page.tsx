/* eslint-disable react-hooks/exhaustive-deps */
import { useExercise } from "@/exercises/exercise.context.tsx"
import { DataTableExercises } from "@/lib/data-table-allExercises.tsx"
import { columns } from "./columns.tsx"
import BoxConteiner from "@/components/ui/BoxConteiner.tsx"
import { useEffect } from "react"

export default function ExercisesTable2() {
  const { allExercises, getAllExercises } = useExercise()

  useEffect(() => {
    getAllExercises()
  }, [])

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="p-5" padding="my-5">
      <h2 className="text-2xl font-medium mb-4 text-gray-100">Tus ejercicios</h2>
      <DataTableExercises columns={columns} data={allExercises} />
    </BoxConteiner>
  )
}
