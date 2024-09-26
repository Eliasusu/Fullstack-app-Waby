"use client"

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, format } from "date-fns"
import { TrainingDay } from '@/trainings/components/trainingDay/TraningDay.tsx'
import { Exercise } from '@/exercises/exercise.type.ts'
import { useTraining } from '@/trainings/training.context.tsx'


type TrainingItem = {
  exercise: Exercise
  sets: number
  reps: number
  weight: string
  rest: string
}


type Training = {
  idTraining: number
  trainingName: string
  trainingType: string
  day: string
  startHour: string
  endHour: string
  completed: boolean
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly'
  trainingItems: TrainingItem[]
}

export default function TrainingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [trainings, setTrainings] = useState<Training[]>([])
  const [newTraining, setNewTraining] = useState<Training>({
    idTraining: 0,
    trainingName: '',
    trainingType: '',
    day: '',
    startHour: '',
    endHour: '',
    completed: false,
    recurrence: 'none',
    trainingItems: []
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { getTrainingToDay } = useTraining()

  const handleAddTraining = () => {
    const trainingWithId = { ...newTraining, id: Date.now().toString() }
    setTrainings([...trainings, trainingWithId])
    setNewTraining({
      idTraining: 0,
      trainingName: '',
      trainingType: '',
      day: '',
      startHour: '',
      endHour: '',
      completed: false,
      recurrence: 'none',
      trainingItems: []
    })
    setIsDialogOpen(false)
  }

  const handleAddTrainingItem = () => {
    setNewTraining({
      ...newTraining,
      trainingItems: [
        ...newTraining.trainingItems,
        { exercise: exercises[0], sets: 0, reps: 0, weight: '', rest: '' }
      ]
    })
  }

  const getTrainingsForDate = (date: Date) => {
    return trainings.filter(training => {
      if (training.recurrence === 'none') {
        return training.date.toDateString() === date.toDateString()
      } else if (training.recurrence === 'daily') {
        return training.date <= date
      } else if (training.recurrence === 'weekly') {
        return training.date <= date && training.date.getDay() === date.getDay()
      } else if (training.recurrence === 'monthly') {
        return training.date <= date && training.date.getDate() === date.getDate()
      }
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Training Calendar</h1>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md  mb-4"
          />
          <TrainingDay date={date} trainings={getTrainingToDay(date?.toString())} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4">Create Training</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Training</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTraining.trainingName}
                onChange={(e) => setNewTraining({ ...newTraining, trainingName: e.target.value })}
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(newTraining.date, 'yyyy-MM-dd')}
                onChange={(e) => setNewTraining({ ...newTraining, date: new Date(e.target.value) })}
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="recurrence">Recurrence</Label>
              <Select onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => setNewTraining({ ...newTraining, recurrence: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Training Items</h3>
              {newTraining.trainingItems.map((item, index) => (
                <div key={index} className="grid gap-2 mb-2">
                  <Select 
                    onValueChange={(value) => {
                      const updatedItems = [...newTraining.trainingItems]
                      updatedItems[index].exercise = exercises.find(e => e.idExercise === Number(value)) || exercises[0]
                      setNewTraining({ ...newTraining, trainingItems: updatedItems })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((exercise) => (
                        <SelectItem key={exercise.idExercise} value={exercise.idExercise?.toString() || ''}>{exercise.name} ({exercise.muscleGroups})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Sets"
                    value={item.sets}
                    onChange={(e) => {
                      const updatedItems = [...newTraining.trainingItems]
                      updatedItems[index].sets = parseInt(e.target.value)
                      setNewTraining({ ...newTraining, trainingItems: updatedItems })
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={item.reps}
                    onChange={(e) => {
                      const updatedItems = [...newTraining.trainingItems]
                      updatedItems[index].reps = parseInt(e.target.value)
                      setNewTraining({ ...newTraining, trainingItems: updatedItems })
                    }}
                  />
                  <Input
                    type="string"
                    placeholder="Weight"
                    value={item.weight}
                    onChange={(e) => {
                      const updatedItems = [...newTraining.trainingItems]
                      updatedItems[index].weight = parseFloat(e.target.value).toString()
                      setNewTraining({ ...newTraining, trainingItems: updatedItems })
                    }}
                  />
                </div>
              ))}
              <Button onClick={handleAddTrainingItem} className="mt-2 w-full">Add Training Item</Button>
            </div>
          </div>
          <Button onClick={handleAddTraining} className="w-full">Save Training</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}