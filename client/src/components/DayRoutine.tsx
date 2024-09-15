import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import BoxContainer from "@/components/ui/BoxConteiner.tsx"
import { ExerciseTraining } from "@/types/exercisesTrainings.type.ts"


const exercises: ExerciseTraining[] = [
  { exercise: "Press de banca", comment: "Mantener codos a 45°", sets: 4, reps: 12, weight: 60,rest: "2'" },
  { exercise: "Aperturas con mancuernas", comment: "Bajar lento", sets: 3, reps: 15, weight: 20,rest: "1'30\"" },
  { exercise: "Fondos en paralelas", comment: "Peso corporal", sets: 4, reps: 10, weight: 0, rest: "2'" },
  { exercise: "Press inclinado con barra", comment: "30° de inclinación", sets: 3, reps: 10, weight: 50,rest: "2'" },
  { exercise: "Pullover con mancuerna", comment: "Estirar bien", sets: 3, reps: 12, weight: 25,rest: "1'30\"" },
  { exercise: "Fondos en paralelas", comment: "Peso corporal", sets: 4, reps: 10, weight: 0, rest: "2'" },
  { exercise: "Aperturas con mancuernas", comment: "Bajar lento", sets: 3, reps: 15, weight: 20,rest: "1'30\"" },
  { exercise: "Press inclinado con barra", comment: "30° de inclinación", sets: 3, reps: 10, weight: 50,rest: "2'" },
  { exercise: "Pullover con mancuerna", comment: "Estirar bien", sets: 3, reps: 12, weight: 25,rest: "1'30\"" },
  { exercise: "Fondos en paralelas", comment: "Peso corporal", sets: 4, reps: 10, weight: 0, rest: "2'" },
  { exercise: "Aperturas con mancuernas", comment: "Bajar lento", sets: 3, reps: 15, weight: 20,rest: "1'30\"" },
]

export default function DayRoutine() {
  const [rutinaCompletada, setRutinaCompletada] = useState(false)
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFin, setHoraFin] = useState("")

  return (
      <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rutina-completada"
              checked={rutinaCompletada}
              onClick={() => setRutinaCompletada(!rutinaCompletada)}
            />
            <CardTitle className="text-lx font-medium">Push day</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <Input
                id="hora-inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="bg-grey-box  text-white"
              />
            </div>
            <div>
              <Input
                id="hora-fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="bg-grey-box  text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border border-gray-500/20">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-500/20">
                  <TableHead className="text-gray-400">Exercise</TableHead>
                  <TableHead className="text-gray-400">Comment</TableHead>
                  <TableHead className="text-right text-gray-400">Sets</TableHead>
                  <TableHead className="text-right text-gray-400">Reps</TableHead>
                  <TableHead className="text-right text-gray-400">Weight</TableHead>
                  <TableHead className="text-right text-gray-400">Rest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {exercises.map((e, index) => (
                  <TableRow key={index} className="border-b border-gray-500/20">
                    <TableCell className="font-medium">{e.exercise}</TableCell>
                    <TableCell>{e.comment}</TableCell>
                    <TableCell className="text-right">{e.sets}</TableCell>
                    <TableCell className="text-right">{e.reps}</TableCell>
                    <TableCell className="text-right">{e.weight} kg</TableCell>
                    <TableCell className="text-right">{e.rest}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
          </ScrollArea>
        </CardContent>
   </BoxContainer>
  )
}

