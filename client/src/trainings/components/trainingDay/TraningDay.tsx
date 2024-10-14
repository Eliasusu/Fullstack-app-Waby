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
import {Training}  from "@/trainings/trainings.type.ts"
import { TrainingItem } from "@/trainingItem/trainingItems.type.ts"
import { useExercise } from "@/exercises/exercise.context.tsx"
import { Calendar } from "@/components/ui/calendar"
import formatDay from "@/lib/formatDay.ts"
import { Exercise } from "@/exercises/exercise.type.ts"


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

const initialTrainingItem: TrainingItem = {
  idTrainingItem: 0,
  exercise: { idExercise: 0, name: '', trainingMethod: '', description: '', muscleGroups: [0], difficulty: '', typeExercise: '' },
  comment: '',
  sets: 0,
  reps: 0,
  weight: '',
  rest: ''
}



export const TrainingDay: React.FC = () => {
  const { training, getTrainingToDay, updateTraining, deleteTraining, addTraining, updateTrainingItem, addTrainingItem, deleteTrainingItem } = useTraining()
  const { exercises, getAllExercises } = useExercise()

  const [date, setDate] = useState<Date>(new Date())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)

  const [localTraining, setLocalTraining] = useState<Training>(initialTraining)
  const [newTraining, setNewTraining] = useState<Training>(initialTraining)
  const [newTrainingItem, setNewTrainingItem] = useState<TrainingItem>(initialTrainingItem)

  useEffect(() => {
    getAllExercises()
  }, [])
  
  useEffect(() => {
    if (!training) {
      setLocalTraining({ ...initialTraining, day: date })
    } else {
      setLocalTraining(training)
    }
  }, [setLocalTraining, training]);


  const handleChangeUpdateTraining = async (field: keyof Training, value: unknown) => {
    if (localTraining) {
      const updatedTraining = { ...localTraining, [field]: value }
      setLocalTraining(updatedTraining)
    }
  }

  const handleSubmitUpdateTraining = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (localTraining) {
      setLocalTraining(localTraining)
      updateTraining(localTraining)
      setIsModifyDialogOpen(false)
    }
    setIsModifyDialogOpen(false)
  }

  const handleChangeCreateTraining = async (field: keyof Training, value: unknown) => {
    const createdTraining = { ...newTraining, [field]: value } as Training
    setNewTraining(createdTraining)
  }

  const handleSubmitCreateTraining = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTraining) {
      addTraining(newTraining)
      setIsCreateDialogOpen(false)
    }
  }

  const handleChangeUpdateTItem = (index: number, field: keyof TrainingItem, value: unknown) => {
    if (field === 'exercise') {
      const updatedExercises = [...localTraining.trainingItems]
      updatedExercises[index] = { ...updatedExercises[index], exercise: value as Exercise }
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      console.log(updatedExercises[index])
      updateTrainingItem(updatedExercises[index], localTraining.idTraining || 0)
      setLocalTraining(updatedTraining)
    }
    if (localTraining) {
      const updatedExercises = [...localTraining.trainingItems]
      updatedExercises[index] = { ...updatedExercises[index], [field]: value }
      const updatedTraining = { ...localTraining, exercisesTrainings: updatedExercises }
      setLocalTraining(updatedTraining)
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
    }
  }

  const handleChangeCreateTItem = (field: keyof TrainingItem, value: unknown) => {
    setNewTrainingItem(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitCreateTItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTraining) {
      addTrainingItem(newTrainingItem, localTraining.idTraining || 0)
      setIsCreateDialogOpen(false)
    }
  }

  const handleDeleteTraining = () => {
    if (localTraining) {
      deleteTraining(localTraining.idTraining || 0)
      setLocalTraining(initialTraining)
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
            if (newDate) {
              setDate(newDate);
            } else {
              setDate(date);
            }
          }}
          onDayClick={(day) => getTrainingToDay(day)}
          className="rounded-md shadow"
        />
      </ContextMenuTrigger>
      {localTraining.idTraining != -1 && (
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDeleteTraining}>Delete Training</ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="completed"
          checked={localTraining?.completed}
          onCheckedChange={(checked) => handleChangeUpdateTraining('completed', checked)}
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
            onChange={(e) => handleChangeUpdateTraining('startHour', e.target.value)}
            className="bg-grey-box text-white"
          />
        </div>
        <div>
          <Input
            id="endHour"
            type="time"
            value={localTraining?.endHour || ''}
            onChange={(e) => handleChangeUpdateTraining('endHour', e.target.value)}
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
              <TableHead className="text-white/90"></TableHead>
              <TableHead className="text-white/90">Exercise</TableHead>
              <TableHead className="text-white/90">Comment</TableHead>
              <TableHead className="text-right text-white/90">Sets</TableHead>
              <TableHead className="text-right text-white/90">Reps</TableHead>
              <TableHead className="text-right text-white/90">Weight</TableHead>
              <TableHead className="text-right text-white/90">Rest</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localTraining?.trainingItems?.map((et, index) => (
              <TableRow key={index} className="border-b border-white/30">
                <TableCell className="font-medium text-gray-400">
                  <Checkbox className="mr-2" />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
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
                                onClickCapture={() => handleChangeUpdateTItem(index, 'exercise', exercise.idExercise)}
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
                    onChange={(e) => handleChangeUpdateTItem(index, 'comment', e.target.value)}
                    className="bg-grey-box border-gray-600"
                  />
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <Input
                    type="number"
                    value={et.sets}
                    onChange={(e) => handleChangeUpdateTItem(index, 'sets', parseInt(e.target.value))}
                    className="bg-grey-box border-gray-600 w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <Input
                    type="number"
                    value={et.reps}
                    onChange={(e) => handleChangeUpdateTItem(index, 'reps', parseInt(e.target.value))}
                    className="bg-grey-box border-gray-600 w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <Input
                    value={et.weight}
                    onChange={(e) => handleChangeUpdateTItem(index, 'weight', e.target.value)}
                    className="bg-grey-box border-gray-600 w-24 text-center"
                  />
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <Input
                    value={et.rest}
                    onChange={(e) => handleChangeUpdateTItem(index, 'rest', e.target.value)}
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
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => setIsCreateDialogOpen(open)}>
          {localTraining.idTraining !== -1 && (
            <>
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
                  <form
                    className="grid gap-4 py-4"
                    onSubmit={handleSubmitCreateTItem}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="exercise" className="text-right">Exercise</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="col-span-3">
                          {newTrainingItem.exercise.name || "Select exercise"}
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
                                  key={exercise.name}
                                  onClickCapture={() => handleChangeCreateTItem('exercise', exercise)}
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
                      value={newTrainingItem.comment}
                      onChange={(e) => handleChangeCreateTItem('comment', e.target.value)}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="sets" className="text-right">Sets</label>
                    <Input
                      id="sets"
                      type="number"
                      value={newTrainingItem.sets}
                      onChange={(e) => handleChangeCreateTItem('sets', parseInt(e.target.value))}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="reps" className="text-right">Reps</label>
                    <Input
                      id="reps"
                      type="number"
                      value={newTrainingItem.reps}
                      onChange={(e) => handleChangeCreateTItem('reps', parseInt(e.target.value))}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 ">
                    <label htmlFor="weight" className="text-right">Weight</label>
                    <Input
                      id="weight"
                      value={newTrainingItem.weight}
                      onChange={(e) => handleChangeCreateTItem('weight', e.target.value)}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="rest" className="text-right">Rest</label>
                    <Input
                      id="rest"
                      value={newTrainingItem.rest}
                      onChange={(e) => handleChangeCreateTItem('rest', e.target.value)}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    </div>
                  <Button>Add Exercise</Button>
                  </form>
                </div>
                <DialogTrigger asChild>
                </DialogTrigger>
              </DialogContent>
            </>
          )}
        </Dialog>
      </div>
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        {localTraining.idTraining !== -1 && (
          <><DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full text-gray-100 bg-secondary hover:text-gray-200 hover:bg-secondary/40 mt-4"
            >
              Modify Training
            </Button>
          </DialogTrigger><DialogContent aria-describedby="modify-training-description">
              <DialogHeader>
                <DialogTitle>Modify Training</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form
                  className="grid gap-4 py-4"
                  onSubmit={handleSubmitUpdateTraining}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="trainingName" className="text-right">Name</label>
                  <Input
                    id="trainingName"
                    value={localTraining?.trainingName || ''}
                    onChange={(e) => handleChangeUpdateTraining('trainingName', e.target.value)}
                    className="col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="trainingType" className="text-right">Type</label>
                  <Input
                    id="trainingType"
                    value={localTraining?.trainingType || ''}
                    onChange={(e) => handleChangeUpdateTraining('trainingType', e.target.value)}
                    className="col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="startHour" className="text-right">Start Time</label>
                  <Input
                    id="startHour"
                    type="time"
                    value={localTraining?.startHour || ''}
                    onChange={(e) => handleChangeUpdateTraining('startHour', e.target.value)}
                    className="col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="endHour" className="text-right">End Time</label>
                  <Input
                    id="endHour"
                    type="time"
                    value={localTraining?.endHour || ''}
                    onChange={(e) => handleChangeUpdateTraining('endHour', e.target.value)}
                    className="col-span-3 w-full" />
                </div>
                    <Button>Save Changes</Button>
                  </form>
              </div>
            </DialogContent></>
        )}
      </Dialog>
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => setIsCreateDialogOpen(open)}>
        {localTraining.idTraining === -1 && (
          <><DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full text-gray-100 bg-primary hover:text-gray-200 hover:bg-redHover mt-4"
            >
              Create Training
            </Button>
          </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Training</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form
                  className="grid gap-4 py-4"
                  onSubmit={() => { handleSubmitCreateTraining }}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="trainingName" className="text-right">Name</label>
                    <Input
                      id="trainingName"
                      onBlur={(e) => handleChangeCreateTraining('trainingName', e.target.value)}
                      className="col-span-3 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="trainingType" className="text-right">Type</label>
                    <Input
                      id="trainingType"
                      value={localTraining?.trainingType || ''}
                      onChange={(e) => handleChangeUpdateTraining('trainingType', e.target.value)}
                      className="col-span-3 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="startHour" className="text-right">Start Time</label>
                    <Input
                      id="startHour"
                      type="time"
                      onBlur={(e) => handleChangeCreateTraining('startHour', e.target.value)}
                      className="col-span-3 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="endHour" className="text-right">End Time</label>
                    <Input
                      id="endHour"
                      type="time"
                      onBlur={(e) => handleChangeCreateTraining('endHour', e.target.value)}
                      className="col-span-3 w-full" />
                  </div>
                  <Button>Create Training</Button>
                </form>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </CardContent>
  </BoxContainer>
  )
}
