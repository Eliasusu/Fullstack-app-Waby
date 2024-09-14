"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BoxContainer from "@/components/ui/BoxConteiner.tsx"

const muscleGroups: Array<keyof typeof exercises> = ["Legs", "Back", "Chest", "Arms", "Shoulders", "Core"]
const exercises = {
  Legs: ["Squats", "Lunges", "Leg Press"],
  Back: ["Pull-ups", "Rows", "Deadlifts"],
  Chest: ["Bench Press", "Push-ups", "Flyes"],
  Arms: ["Bicep Curls", "Tricep Extensions", "Hammer Curls"],
  Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"],
  Core: ["Crunches", "Planks", "Russian Twists"],
}

export default function Component() {
  const [selectedExercise, setSelectedExercise] = React.useState("")
  const [editedExercise, setEditedExercise] = React.useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleExerciseClick = (exercise: string) => {
    setSelectedExercise(exercise)
    setEditedExercise(exercise)
    setIsEditDialogOpen(true)
  }

  const handleSaveExercise = () => {
    console.log(`Exercise "${selectedExercise}" updated to "${editedExercise}"`)
    setIsEditDialogOpen(false)
  }

  return (
    <BoxContainer  width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding='my-6 p-6 relative'>
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Grupos musculares</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="max-w-screen-xs md:max-w-screen-md lg:max-w-screen-lg mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml">
          {muscleGroups.map((group, index) => (
            <CarouselItem key={index} className="pl-2 xs:pl-4 xs:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-24 h-24 text-lg font-semibold bg-gray-box2 text-white hover:bg-grey-nav rounded-lg"
                    >
                      {group}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="xs:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{group} Exercises</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableBody>
                        {exercises[group].map((exercise) => (
                          <TableRow key={exercise} className="cursor-pointer hover:bg-grey-nav" onClick={() => handleExerciseClick(exercise)}>
                            <TableCell>{exercise}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exercise" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedExercise}
                onChange={(e) => setEditedExercise(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exercise" className="text-right">
                Exercise
              </Label>
              <Input
                id="exercise"
                value={editedExercise}
                onChange={(e) => setEditedExercise(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="items-center">
            <Button className="bg-grey-box" type="submit" onClick={handleSaveExercise}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BoxContainer>
  )
}