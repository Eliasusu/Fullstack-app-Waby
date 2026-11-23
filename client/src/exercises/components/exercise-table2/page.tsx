/* eslint-disable react-hooks/exhaustive-deps */
import { useExercise } from "@/exercises/exercise.context.tsx"
import { DataTableExercises } from "@/lib/data-table-allExercises.tsx"
import { columns } from "./columns.tsx"
import BoxConteiner from "@/components/ui/BoxConteiner.tsx"
import { useEffect } from "react"
import { boxWidth } from "@/lib/layout.ts"

export default function ExercisesTable2() {
  const { allExercises, getAllExercises, loading } = useExercise()

  useEffect(() => {
    getAllExercises()
  }, [])

  return (
    <BoxConteiner width={boxWidth} height="p-5" padding="my-5">
      <h2 className="text-2xl font-medium mb-4 text-gray-100">Tus ejercicios</h2>
      <DataTableExercises columns={columns} data={allExercises} loading={loading} />
    </BoxConteiner>
  )
}
