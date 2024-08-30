import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import BoxContainer from "./BoxConteiner.tsx"

type Ejercicio = {
  nombre: string
  comentario: string
  series: number
  repeticiones: number
  peso: number
  descanso: string
}

const ejercicios: Ejercicio[] = [
  { nombre: "Press de banca", comentario: "Mantener codos a 45°", series: 4, repeticiones: 12, peso: 60, descanso: "2'" },
  { nombre: "Aperturas con mancuernas", comentario: "Bajar lento", series: 3, repeticiones: 15, peso: 20, descanso: "1'30\"" },
  { nombre: "Fondos en paralelas", comentario: "Peso corporal", series: 4, repeticiones: 10, peso: 0, descanso: "2'" },
  { nombre: "Press inclinado con barra", comentario: "30° de inclinación", series: 3, repeticiones: 10, peso: 50, descanso: "2'" },
  { nombre: "Pullover con mancuerna", comentario: "Estirar bien", series: 3, repeticiones: 12, peso: 25, descanso: "1'30\"" },
  { nombre: "Fondos en paralelas", comentario: "Peso corporal", series: 4, repeticiones: 10, peso: 0, descanso: "2'" },
  { nombre: "Aperturas con mancuernas", comentario: "Bajar lento", series: 3, repeticiones: 15, peso: 20, descanso: "1'30\"" },
  { nombre: "Press inclinado con barra", comentario: "30° de inclinación", series: 3, repeticiones: 10, peso: 50, descanso: "2'" },
  { nombre: "Pullover con mancuerna", comentario: "Estirar bien", series: 3, repeticiones: 12, peso: 25, descanso: "1'30\"" },
  { nombre: "Fondos en paralelas", comentario: "Peso corporal", series: 4, repeticiones: 10, peso: 0, descanso: "2'" },
  { nombre: "Aperturas con mancuernas", comentario: "Bajar lento", series: 3, repeticiones: 15, peso: 20, descanso: "1'30\"" },
]

export default function DayRoutine() {
  const [rutinaCompletada, setRutinaCompletada] = useState(false)
  const [horaInicio, setHoraInicio] = useState("17:00")
  const [horaFin, setHoraFin] = useState("19:00")

  return (
      <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="">
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
                  <TableHead className="text-gray-400">Ejercicio</TableHead>
                  <TableHead className="text-gray-400">Comentario</TableHead>
                  <TableHead className="text-right text-gray-400">Series</TableHead>
                  <TableHead className="text-right text-gray-400">Reps</TableHead>
                  <TableHead className="text-right text-gray-400">Peso</TableHead>
                  <TableHead className="text-right text-gray-400">Descanso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ejercicios.map((ejercicio, index) => (
                  <TableRow key={index} className="border-b border-gray-500/20">
                    <TableCell className="font-medium">{ejercicio.nombre}</TableCell>
                    <TableCell>{ejercicio.comentario}</TableCell>
                    <TableCell className="text-right">{ejercicio.series}</TableCell>
                    <TableCell className="text-right">{ejercicio.repeticiones}</TableCell>
                    <TableCell className="text-right">{ejercicio.peso} kg</TableCell>
                    <TableCell className="text-right">{ejercicio.descanso}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" aria-orientation="vertical"/>
          </ScrollArea>
        </CardContent>
   </BoxContainer>
  )
}