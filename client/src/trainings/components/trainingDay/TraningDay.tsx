/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { X } from 'lucide-react'
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
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/hooks/use-toast.ts"
import {Training}  from "@/trainings/trainings.type.ts"
import { TrainingItem } from "@/trainingItem/trainingItems.type.ts"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/users/auth.context.tsx"

export const TrainingDay: React.FC = () => {
  const { training ,getTrainingToDay, updateTraining, deleteTraining, addTraining ,updateTrainingItem, addTrainingItem, deleteTrainingItem } = useTraining()
  const { user } = useAuth()
  const [localTraining, setLocalTraining] = useState<Training | null>(null)
  const { exercises, getAllExercises } = useExercise()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [newExercise, setNewExercise] = useState<TrainingItem>({
    exercise: { idExercise: 0, name: '', trainingMethod: '', description: '', muscleGroups: [0], difficulty: '', typeExercise: '' },
    comment: '',
    sets: 0,
    reps: 0,
    weight: '',
    rest: ''
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => { 
    getAllExercises()
  },[])

  useEffect(() => {
    if (!training) setLocalTraining(null)
    if (training) setLocalTraining(training)
  }, [setLocalTraining, training])
  

  const formatDay = (dateString: Date) => {
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

  const handleExerciseUpdate = (index: number, field: keyof TrainingItem, value: unknown) => {
    if (localTraining) {
      const updatedExercises = [...localTraining.trainingItems]
      updatedExercises[index] = { ...updatedExercises[index], [field]: value }
      console.log('updatedExercises', updatedExercises[index])
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTrainingItem(updatedExercises[index], localTraining.idTraining || 0)
      toast({
        title: "Cambios guardados",
        description: "Los cambios se han guardado correctamente.",
      })
    }
  }

  const handleDelete = (index: number) => {
    if (localTraining) {
      const updatedExercises = localTraining.trainingItems.filter((_, i) => i !== index)
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
      const idTrainingItem = localTraining.trainingItems[index].idTrainingItem;
      if (idTrainingItem !== undefined) {
        deleteTrainingItem(idTrainingItem, localTraining.idTraining || 0);
      }
      toast({
        title: "Ejercicio eliminado",
        description: "El ejercicio se ha eliminado correctamente.",
      })
    }
  }

  const handleNewExerciseChange = (field: keyof TrainingItem, value: unknown) => {
    setNewExercise(prev => ({ ...prev, [field]: value }))
  }

  const addExercise = () => {
    if (localTraining) {
      const updatedExercises = [...localTraining.trainingItems, newExercise]
      const updatedTraining = { ...localTraining, trainingItems: updatedExercises }
      setLocalTraining(updatedTraining)
      addTrainingItem(newExercise, localTraining.idTraining || 0)
      toast({
        title: "Ejercicio añadido",
        description: "Se ha añadido un nuevo ejercicio.",
      })
      // Reset the newExercise state
      setNewExercise({
        exercise: { idExercise: 0, name: '', trainingMethod: '', description: '', muscleGroups: [0], difficulty: '', typeExercise: '' },
        comment: '',
        sets: 0,
        reps: 0,
        weight: '',
        rest: ''
      })
    }
  }

  const handleCreateTraining = () => {
    console.log(setIsCreateDialogOpen)
    if (selectedDate) {
      const newTraining: Training = {
        trainingName: 'New Training',
        day: selectedDate,
        startHour: '09:00',
        endHour: '10:00',
        completed: false,
        trainingItems: [],
        user: user?.username || '',
        trainingType: ""
      }
      addTraining(newTraining)
      setIsCreateDialogOpen(false)
      toast({
        title: "Entrenamiento creado",
        description: "Se ha creado un nuevo entrenamiento.",
      })
    }
  }

  const handleModifyTraining = () => {
    console.log(setIsModifyDialogOpen)
    if (localTraining) {
      console.log('idTraining en el handleModify', localTraining.idTraining)
      updateTraining(localTraining)
      setIsModifyDialogOpen(false)
      toast({
        title: "Entrenamiento modificado",
        description: "Se han guardado los cambios en el entrenamiento.",
      })
    }
  }

  const handleDeleteTraining = () => {
    if (localTraining) {
      console.log('idTraining en el handleDelete', localTraining.idTraining)
      deleteTraining(localTraining.idTraining || 0)
      setLocalTraining(null)
      toast({
        title: "Entrenamiento eliminado",
        description: "Se ha eliminado el entrenamiento.",
      })
    }
  }
  
  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
        <ContextMenu>
        <ContextMenuTrigger>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                setSelectedDate(newDate);
              }}
              onDayClick={(day) => getTrainingToDay(day)}
              className="rounded-md shadow"
            />

        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => setIsCreateDialogOpen(true)}>
            Crear entrenamiento
          </ContextMenuItem>
          {localTraining && (
            <>
              <ContextMenuItem onSelect={() => setIsModifyDialogOpen(true)}>
                Modificar entrenamiento
              </ContextMenuItem>
              <ContextMenuItem onSelect={handleDeleteTraining}>
                Eliminar entrenamiento
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
            id="completed"
            checked={localTraining?.completed}
            onCheckedChange={(checked) => handleUpdate('completed', checked)}
            />
            <CardTitle className="text-xl font-medium">{localTraining?.trainingName || 'Empty'}</CardTitle>
          </div>
        <div className="flex items-center space-x-2">
          <div id="day" className="font-light text-white/75 text-xs">
            <p>{formatDay(date || new Date())}</p>
          </div>
          <div>
            <Input
              id="startHour"
              type="time"
              value={localTraining?.startHour || ''}
              onChange={(e) => handleUpdate('startHour', e.target.value)}
              className="bg-grey-box text-white"
            />
          </div>
          <div>
            <Input
              id="endHour"
              type="time"
              value={localTraining?.endHour || ''}
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
              {localTraining?.trainingItems?.map((et, index) => (
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
                        <CommandList>
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                          {exercises.map((exercise) => (
                            <CommandItem
                              key={exercise.idExercise}
                              onSelect={() => handleExerciseUpdate(index, 'exercise', exercise)}
                              onClick={() => handleExerciseUpdate(index, 'exercise', exercise)}
                            >
                              {exercise.name}
                            </CommandItem>
                          ))}
                          </CommandGroup>
                          </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  </TableCell>
                  <TableCell className="font-medium text-gray-400">
                    <Input
                      value={et.comment}
                      onChange={(e) => handleExerciseUpdate(index, 'comment', e.target.value)}
                      className="bg-grey-box border-gray-600"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      type="number"
                      value={et.sets}
                      onChange={(e) => handleExerciseUpdate(index, 'sets', parseInt(e.target.value))}
                      className="bg-grey-box border-gray-600 w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      type="number"
                      value={et.reps}
                      onChange={(e) => handleExerciseUpdate(index, 'reps', parseInt(e.target.value))}
                      className="bg-grey-box border-gray-600 w-16 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      value={et.weight}
                      onChange={(e) => handleExerciseUpdate(index, 'weight', e.target.value)}
                      className="bg-grey-box border-gray-600 w-24 text-center"
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <Input
                      value={et.rest}
                      onChange={(e) => handleExerciseUpdate(index, 'rest', e.target.value)}
                      className="bg-grey-box border-gray-600 w-24 text-center"
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
        <div>
          <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full text-gray-100 bg-primary hover:text-gray-200 hover:bg-redHover mt-4"
            >
              Add exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="exercise" className="text-right">Exercise</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3">
                      {newExercise.exercise.name || "Select exercise"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search exercise..." />
                      <CommandList>
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                          {exercises.map((exercise) => (
                            <CommandItem
                              key={exercise.idExercise}
                              onSelect={() => handleNewExerciseChange('exercise', exercise)}
                            >
                              {exercise.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="comment" className="text-right">Comment</label>
                <Input
                  id="comment"
                  value={newExercise.comment}
                  onChange={(e) => handleNewExerciseChange('comment', e.target.value)}
                  className="col-span-3 bg-grey-box border-gray-600 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="sets" className="text-right">Sets</label>
                <Input
                  id="sets"
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => handleNewExerciseChange('sets', parseInt(e.target.value))}
                  className="col-span-3 bg-grey-box border-gray-600 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="reps" className="text-right">Reps</label>
                <Input
                  id="reps"
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => handleNewExerciseChange('reps', parseInt(e.target.value))}
                  className="col-span-3 bg-grey-box border-gray-600 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <label htmlFor="weight" className="text-right">Weight</label>
                <Input
                  id="weight"
                  value={newExercise.weight}
                  onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
                  className="col-span-3 bg-grey-box border-gray-600 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="rest" className="text-right">Rest</label>
                <Input
                  id="rest"
                  value={newExercise.rest}
                  onChange={(e) => handleNewExerciseChange('rest', e.target.value)}
                  className="col-span-3 bg-grey-box border-gray-600 w-full"
                />
              </div>
          </div>
              <DialogTrigger asChild>
                <div>
                    <Button onClick={addExercise}>Add Exercise</Button>
                  </div>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
        </div>
      </CardContent>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Training</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="trainingName" className="text-right">Name</label>
              <Input
                id="trainingName"
                value={localTraining?.trainingName || ''}
                onChange={(e) => handleUpdate('trainingName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startHour" className="text-right">Start Time</label>
              <Input
                id="startHour"
                type="time"
                value={localTraining?.startHour || ''}
                onChange={(e) => handleUpdate('startHour', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endHour" className="text-right">End Time</label>
              <Input
                id="endHour"
                type="time"
                value={localTraining?.endHour || ''}
                onChange={(e) => handleUpdate('endHour', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
            <div>
              <Button onClick={handleCreateTraining}>Create Training</Button>
            </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent aria-describedby="modify-training-description">
          <DialogHeader>
            <DialogTitle>Modify Training</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="trainingName" className="text-right">Name</label>
              <Input
                id="trainingName"
                value={localTraining?.trainingName || ''}
                onChange={(e) => handleUpdate('trainingName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startHour" className="text-right">Start Time</label>
              <Input
                id="startHour"
                type="time"
                value={localTraining?.startHour || ''}
                onChange={(e) => handleUpdate('startHour', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endHour" className="text-right">End Time</label>
              <Input
                id="endHour"
                type="time"
                value={localTraining?.endHour || ''}
                onChange={(e) => handleUpdate('endHour', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleModifyTraining}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </BoxContainer>
  )
}