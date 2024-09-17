import { useEffect, useState } from "react"
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
import { useTraining } from "@/context/TrainingContext.tsx"


export default function DayRoutine() {
  const [completed, setCompleted] = useState(false)
  const [starHour, setStarHour] = useState("")
  const [endHour, setEndHour] = useState("")
  const { trainings, getTrainingToDay } = useTraining()

    useEffect(() => {
      const interval = setInterval(() => {
        const today = new Date()
        const formattedDate = today.toISOString().split('T')[0]
        
      getTrainingToDay(formattedDate)
      }, 60 * 1000)
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0]
      getTrainingToDay(formattedDate)
      

    return () => {
      clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
      <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={completed}
              onClick={() => setCompleted(!completed)}
            />
            <CardTitle className="text-lx font-medium">Push day</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <Input
                id="startHour"
                type="time"
                value={starHour}
                onChange={(e) => setStarHour(e.target.value)}
                className="bg-grey-box  text-white"
              />
            </div>
            <div>
              <Input
                id="endHour"
                type="time"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
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
                {trainings.map((t, index) => (
                  t.exercisesTrainings.map((et, etIndex) => (
                    <TableRow key={`${index}-${etIndex}`} className="border-b border-gray-500/20">
                      <TableCell className="font-medium">{et.exercise.name}</TableCell>
                      <TableCell>{et.comment}</TableCell>
                      <TableCell className="text-right">{et.sets}</TableCell>
                      <TableCell className="text-right">{et.reps}</TableCell>
                      <TableCell className="text-right">{et.weight} kg</TableCell>
                      <TableCell className="text-right">{et.rest}</TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
          </Table>
          </ScrollArea>
        </CardContent>
   </BoxContainer>
  )
}

