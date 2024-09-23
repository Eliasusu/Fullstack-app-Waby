import React, { useEffect, useState } from "react"
import { X, PlusIcon } from 'lucide-react'
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
import { Button } from "@/components/ui/button"
import BoxContainer from "@/components/ui/BoxConteiner"
import { useTraining } from "@/trainings/training.context"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast.ts"
import Training  from "@/trainings/trainings.type.ts"
import { ExerciseTraining } from "@/exercises_trainings/exercisesTrainings.type.ts"
import { useExercise } from "@/exercises/exercise.context.tsx"


export const TrainingDay: React.FC = () => {
  const { training, getTrainingToDay, updateTraining } = useTraining()
    const [localTraining, setLocalTraining] = useState<Training | null>(null)
    const { exercises, updateExercise, getAllExercises } = useExercise()

  useEffect(() => { 
    const fetchExercises = () => { 
      getAllExercises() 
    }
    fetchExercises()
    const intervalId = setInterval(fetchExercises, 180000)
    return () => clearInterval(intervalId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    const fetchTraining = () => {
      const today = new Date().toISOString().split('T')[0]
      getTrainingToDay(today)
    }

    fetchTraining()

    const intervalId = setInterval(fetchTraining, 180000)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (training) {
      setLocalTraining(training)
    }
  }, [training])

  const formatDay = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    return `${day} ${month}`
  }

  const handleUpdate = (field: keyof Training, value: unknown) => {
    if (localTraining) {
      const updatedTraining = { ...localTraining, [field]: value }
      setLocalTraining(updatedTraining)
      updateTraining(updatedTraining)
      toast({
        title: "Cambios guardados",
        description: "Los cambios se han guardado correctamente.",
      })
    }
  }

  const handleExerciseUpdate = (index: number, field: keyof ExerciseTraining, value: unknown) => {
    if (localTraining) {
      const updatedExercises = [...localTraining.exercisesTrainings]
      updatedExercises[index] = { ...updatedExercises[index], [field]: value }
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTraining(updatedTraining)
      toast({
        title: "Cambios guardados",
        description: "Los cambios se han guardado correctamente.",
      })
    }
  }

  const handleDelete = (index: number) => {
    if (localTraining) {
      const updatedExercises = localTraining.exercisesTrainings.filter((_, i) => i !== index)
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTraining(updatedTraining)
      toast({
        title: "Ejercicio eliminado",
        description: "El ejercicio se ha eliminado correctamente.",
      })
    }
  }

  const addExercise = () => {
    if (localTraining) {
        const newExercise: ExerciseTraining = {
        idExerciseTraining: 0,
        exercise: { idExercise: 0, name: 'New Exercise', trainingMethod: '', description: '', muscleGroups: [''], difficulty: '', typeExercise: '' },
        comment: '',
        sets: 0,
        reps: 0,
        weight:'',
        rest: ''
      }
      const updatedExercises = [...localTraining.exercisesTrainings, newExercise]
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTraining(updatedTraining)
      toast({
        title: "Ejercicio añadido",
        description: "Se ha añadido un nuevo ejercicio.",
      })
    }
  }

  if (!localTraining) return null

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={localTraining.completed}
            onCheckedChange={(checked) => handleUpdate('completed', checked)}
          />
          <CardTitle className="text-xl font-medium">{localTraining.trainingName || 'Empty'}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <div id="day" className="font-light text-white/75 text-xs">
            <p>{formatDay(localTraining.day)}</p>
          </div>
          <div>
            <Input
              id="startHour"
              type="time"
              value={localTraining.startHour}
              onChange={(e) => handleUpdate('startHour', e.target.value)}
              className="bg-grey-box text-white"
            />
          </div>
          <div>
            <Input
              id="endHour"
              type="time"
              value={localTraining.endHour}
              onChange={(e) => handleUpdate('endHour', e.target.value)}
              className="bg-grey-box text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-white/30 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/20">
                <TableHead className="text-white/90">Exercise</TableHead>
                <TableHead className="text-white/90">Comment</TableHead>
                <TableHead className="text-right text-white/90">Sets</TableHead>
                <TableHead className="text-right text-white/90">Reps</TableHead>
                <TableHead className="text-right text-white/90">Weight</TableHead>
                <TableHead className="text-right text-white/90">Rest</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localTraining.exercisesTrainings.map((et, index) => (
                <TableRow key={index} className="border-b border-white/30">
                  <TableCell className="font-medium text-gray-400">
                    <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
                        <Checkbox className="mr-2" />
                        {et.exercise.name}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search exercise..." />
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                          {exercises.map((exercise) => (
                            <CommandItem
                              key={exercise.idExercise}
                              onSelect={() => updateExercise(exercise)}
                            >
                              {exercise.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  </TableCell>
                  <TableCell className="font-medium text-gray-400">
                    <Input
                      value={et.comment}
                      onChange={(e) => handleExerciseUpdate(index, 'comment', e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      type="number"
                      value={et.sets}
                      onChange={(e) => handleExerciseUpdate(index, 'sets', parseInt(e.target.value))}
                      className="bg-gray-700 border-gray-600 w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      type="number"
                      value={et.reps}
                      onChange={(e) => handleExerciseUpdate(index, 'reps', parseInt(e.target.value))}
                      className="bg-gray-700 border-gray-600 w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      value={et.weight}
                      onChange={(e) => handleExerciseUpdate(index, 'weight', e.target.value)}
                      className="bg-gray-700 border-gray-600 w-24 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      value={et.rest}
                      onChange={(e) => handleExerciseUpdate(index, 'rest', e.target.value)}
                      className="bg-gray-700 border-gray-600 w-24 text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button 
          variant="ghost" 
          className="w-full text-gray-400 hover:text-gray-200 hover:bg-gray-700 mt-4"
          onClick={addExercise}
        >
          <PlusIcon className="mr-2" />
          Add exercise
        </Button>
      </CardContent>
    </BoxContainer>
  )
}