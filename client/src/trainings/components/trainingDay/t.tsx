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
import { Training } from "@/trainings/trainings.type.ts"
import { TrainingItem } from "@/trainingItem/trainingItems.type.ts"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { Calendar } from "@/components/ui/calendar"

export const TrainingDay: React.FC = () => {
  const { training, getTrainingToDay, updateTraining, updateTrainingItem, createTraining, deleteTraining } = useTraining()
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [newTraining, setNewTraining] = useState<Omit<Training, 'idTraining' | 'trainingDate'>>({
    trainingName: '',
    startHour: '',
    endHour: '',
    completed: false,
    trainingItems: []
  })

  useEffect(() => {
    const fetchTraining = async () => {
      if (!date) {
        const today = new Date()
        getTrainingToDay(today)
      } else {
        getTrainingToDay(date)
      }
    }
    
    fetchTraining()
    
    if (!localTraining) {
      fetchTraining()
    }
  }, [])
  
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
      const updatedTraining = { ...localTraining, trainingItems: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTrainingItem(updatedExercises[index], localTraining.idTraining)
      toast({
        title: "Cambios guardados",
        description: "Los cambios se han guardado correctamente.",
      })
    }
  }

  const handleDelete = (index: number) => {
    if (localTraining) {
      const updatedExercises = localTraining.trainingItems.filter((_, i) => i !== index)
      const updatedTraining = { ...localTraining, trainingItems: updatedExercises }
      setLocalTraining(updatedTraining)
      updateTraining(updatedTraining)
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
      updateTrainingItem(newExercise, localTraining.idTraining)
      toast({
        title: "Ejercicio añadido",
        description: "Se ha añadido un nuevo ejercicio.",
      })
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
    selectedDates.forEach(date => {
      const newTrainingWithDate: Training = {
        ...newTraining,
        idTraining: 0, // This will be set by the backend
        trainingDate: date,
      }
      createTraining(newTrainingWithDate)
    })
    setIsCreateDialogOpen(false)
    setSelectedDates([])
    setNewTraining({
      trainingName: '',
      startHour: '',
      endHour: '',
      completed: false,
      trainingItems: []
    })
    toast({
      title: "Entrenamientos creados",
      description: `Se han creado ${selectedDates.length} nuevos entrenamientos.`,
    })
  }

  const handleModifyTraining = () => {
    if (localTraining) {
      selectedDates.forEach(date => {
        const modifiedTraining: Training = {
          ...localTraining,
          trainingDate: date,
        }
        updateTraining(modifiedTraining)
      })
      setIsModifyDialogOpen(false)
      setSelectedDates([])
      toast({
        title: "Entrenamientos modificados",
        description: `Se han modificado ${selectedDates.length} entrenamientos.`,
      })
    }
  }

  const handleDeleteTraining = () => {
    if (localTraining) {
      deleteTraining(localTraining.idTraining)
      setLocalTraining(null)
      toast({
        title: "Entrenamiento eliminado",
        description: "Se ha eliminado el entrenamiento.",
      })
    }
  }

  const handleNewTrainingChange = (field: keyof typeof newTraining, value: unknown) => {
    setNewTraining(prev => ({ ...prev, [field]: value }))
  }

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
      <div>
        <ContextMenu>
          <ContextMenuTrigger>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate)
                setSelectedDate(newDate)
              }}
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
      </div>
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
              value={localTraining?.startHour}
              onChange={(e) => handleUpdate('startHour', e.target.value)}
              className="bg-grey-box text-white"
            />
          </div>
          <div>
            <Input
              id="endHour"
              type="time"
              value={localTraining?.endHour}
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
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="sets" className="text-right">Sets</label>
                <Input
                  id="sets"
                  type="number"
                  value={newExercise.sets}
                  onChange={(e) => handleNewExerciseChange('sets', parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="reps" className="text-right">Reps</label>
                <Input
                  id="reps"
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => handleNewExerciseChange('reps', parseInt(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="weight" className="text-right">Weight</label>
                <Input
                  id="weight"
                  value={newExercise.weight}
                  onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="rest" className="text-right">Rest</label>
                <Input
                  id="rest"
                  value={newExercise.rest}
                  onChange={(e) => handleNewExerciseChange('rest', e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogTrigger asChild>
              <Button onClick={addExercise}>Add Exercise</Button>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
      </CardContent>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Training</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="trainingName" className="text-right">Name</label>
              <Input
                id="trainingName"
                value={newTraining.trainingName}
                onChange={(e) => handleNewTrainingChange('trainingName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startHour" className="text-right">Start Time</label>
              <Input
                id="startHour"
                type="time"
                value={newTraining.startHour}
                onChange={(e) => handleNewTrainingChange('startHour', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endHour" className="text-right">End Time</label>
              <Input
                id="endHour"
                type="time"
                value={newTraining.endHour}
                onChange={(e) => handleNewTrainingChange('endHour', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Select Dates</label>
              <div className="col-span-3">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleCreateTraining}>Create Training</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Select Dates</label>
              <div className="col-span-3">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleModifyTraining}>Save Changes</Button>
        </DialogContent>
      </Dialog>
    </BoxContainer>
  )
}import { toLocaleString } from "assert"
import { getDate } from "date-fns"
import { type } from "os"
import { title } from "process"
import { FC } from "react"
