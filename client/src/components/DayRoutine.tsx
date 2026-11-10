import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import BoxContainer from "@/components/ui/BoxConteiner.tsx"
import { useTraining } from "@/trainings/training.context.tsx"
import { formatDay } from "@/lib/dates.ts"
import { notifyErrors } from "@/lib/notify.ts"


export const DayRoutine = ({ date }: { date: Date }) => {
  const { training, getTrainingToDay, updateTraining } = useTraining()

  useEffect(() => {
    getTrainingToDay(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCompleted = async () => {
    if (!training) return
    const result = await updateTraining(training.id, { completed: !training.completed })
    if (!result.ok) notifyErrors(result.errors)
  }

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={training?.completed ?? false}
            disabled={!training}
            onClick={toggleCompleted}
          />
          <CardTitle className="text-xl font-medium">{training?.name || 'Empty'}</CardTitle>
        </div>
        <div id="day" className="font-light text-white/75 text-xs">
          <p>{formatDay(date)}</p>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="border border-white/30 rounded-xl">
          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-white/20">
                <TableHead className="text-white/90">Exercise</TableHead>
                <TableHead className="text-white/90">Comment</TableHead>
                <TableHead className="text-right text-white/90">Sets</TableHead>
                <TableHead className="text-right text-white/90">Reps / Secs</TableHead>
                <TableHead className="text-right text-white/90">Weight (kg)</TableHead>
                <TableHead className="text-right text-white/90">Rest (s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                training?.items.map((item) => (
                  <TableRow key={item.id} className="border-b border-white/30">
                    <TableCell className="font-medium text-gray-400">{item.exercise.name}</TableCell>
                    <TableCell className="font-medium text-gray-400">{item.comment ?? ''}</TableCell>
                    <TableCell className="text-right text-gray-400">{item.sets}</TableCell>
                    <TableCell className="text-right text-gray-400">{item.reps ?? (item.seconds != null ? `${item.seconds} s` : '')}</TableCell>
                    <TableCell className="text-right text-gray-400">{item.weightKg ?? ''}</TableCell>
                    <TableCell className="text-right text-gray-400">{item.restSeconds ?? ''}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </BoxContainer>
  )
}
