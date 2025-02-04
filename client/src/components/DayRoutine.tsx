import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import BoxContainer from "@/components/ui/BoxConteiner.tsx"
import { useTraining } from "@/trainings/training.context.tsx"
import { Training } from "@/trainings/trainings.type.ts"


const initialTraining: Training = {
  idTraining: -1,
  trainingName: '',
  startHour: '',
  endHour: '',
  day: new Date(),
  completed: false,
  user: '',
  trainingType: '',
  trainingItems: []
}


export const DayRoutine = ({ date }: { date: Date }) => {
  const [startHour, setStartHour] = useState("")
  const [endHour, setEndHour] = useState("")
  const [localTraining, setLocalTraining] = useState<Training>(initialTraining)
  //Traigo de useTraining el training y getTrainingToDay
  const { training, getTrainingToDay, updateTraining } = useTraining()


  //useEffect para traer el training del día, actualizarlo cada 3 minutos
  //Utilizo los diferentes estados para actualizar el training
  //Si no hay training, se muestra "Empty"
  useEffect(() => {
    const fetchTraining = () => {
      //Obtengo el training del día
      getTrainingToDay(date);

      //Actualizo los estados del training
      setStartHour(training?.startHour || "");
      setEndHour(training?.endHour || "");
      setLocalTraining(training || initialTraining);
    };

    fetchTraining();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeUpdateTraining = async (field: keyof Training, value: string | boolean) => {
    if (field === 'completed') {
      const updatedTraining = { ...localTraining, [field]: value as boolean }
      updateTraining(updatedTraining)
      setLocalTraining(updatedTraining)
    }
  }

  //Funcion para formatear la fecha en formato "dd MMM"
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  //Guardo la fecha en formato string
  const dateFormat = date.toString();
  //Guardo la fecha formateada
  const formattedDay = formatDay(dateFormat);

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={localTraining?.completed}
            onClick={() => handleChangeUpdateTraining('completed', !localTraining?.completed)}
          />
          <CardTitle className="text-xl font-medium">{training?.trainingName || 'Empty'}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <div id="day" className="font-light text-white/75 text-xs">
            <p>{formattedDay}</p>
          </div>
          <div>
            <Input
              id="startHour"
              type="string"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="bg-grey-box  text-white"
            />
          </div>
          <div>
            <Input
              id="endHour"
              type="string"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="bg-grey-box  text-white"
            />
          </div>
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
                <TableHead className="text-right text-white/90">Reps</TableHead>
                <TableHead className="text-right text-white/90">Weight</TableHead>
                <TableHead className="text-right text-white/90">Rest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                training?.trainingItems.map((et, etIndex) => (
                  <TableRow key={`${etIndex}`} className="border-b border-white/30">
                    <TableCell className="font-medium text-gray-400">{et.exercise.name ?? ''}</TableCell>
                    <TableCell className="font-medium text-gray-400">{et.comment}</TableCell>
                    <TableCell className="text-right text-gray-400">{et.sets ?? ''}</TableCell>
                    <TableCell className="text-right text-gray-400">{et.reps ?? ''}</TableCell>
                    <TableCell className="text-right text-gray-400">{et.weight ?? ''}</TableCell>
                    <TableCell className="text-right text-gray-400">{et.rest ?? ''}</TableCell>
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
