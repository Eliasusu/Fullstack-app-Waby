
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import  BoxConteiner  from "@/components/ui/BoxConteiner.tsx"

const muscleGroups = [
  "Legs",
  "Arms",
  "Back",
  "Shoulders",
  "Chest",
  "Core"
]

export default function Component() {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [showAddExercise, setShowAddExercise] = useState(false)

  const handleAddExercise = () => {
    setShowAddExercise(true)
  }

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="p-5" padding="my-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Grupos musculares</h2>
      <div className="grid grid-cols-3 h-full md:grid-cols-3 gap-5">
        {muscleGroups.map((group) => (
          <Card 
            key={group} 
            className="bg-gray-box2 h-24 border-white/40 transition-all duration-300 hover:bg-grey-boxActivity hover:scale-105 cursor-pointer"
            onClick={() => setOpenDialog(group)}
          >
            <CardContent className="p-4 flex items-center justify-center h-24">
              <p className="text-lg font-medium text-gray-100">{group}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog !== null} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="bg-grey-bg text-gray-100 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Exercises by muscle group</DialogTitle>
        </DialogHeader>
            
        <h3 className="text-xl font-semibold">{openDialog}</h3>
        <div className="border rounded-md">
          <Table className="">
            <TableHeader className="">
              <TableRow className="">
                <TableHead className="text-gray-300">Ejercicio</TableHead>
                <TableHead className="text-gray-300">Método</TableHead>
                <TableHead className="text-gray-300">Descripción</TableHead>
                <TableHead className="text-gray-300">Grupos musculares</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              <TableRow>
                <TableCell colSpan={4}>
                  <button 
                    className="w-full flex items-center justify-center py-0 text-gray-400 hover:text-gray-100 transition-colors"
                    onClick={handleAddExercise}
                  >
                    <PlusIcon className="mr-2" />
                    Add Exercise
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
            </Table>
          </div>
        </DialogContent> 
      </Dialog>

      <Dialog open={showAddExercise} onOpenChange={() => setShowAddExercise(false)}>
        <DialogContent className="bg-grey-bg text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add a exercise</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" className="bg-grey-box border-gray-600 w-full" />
            </div>
            <div>
              <Label htmlFor="method">Método</Label>
              <Select >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  <SelectItem className="text-white" value="method1">Method 1</SelectItem>
                  <SelectItem className="text-white" value="method2">Method 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" className="bg-grey-box border-gray-600 w-full" />
            </div>
            <div>
              <Label htmlFor="muscleGroup">Grupo Muscular</Label>
              <Select>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {muscleGroups.map((group) => (
                    <SelectItem className="text-white" key={group} value={group.toLowerCase()}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  <SelectItem className="text-white" value="easy">Easy</SelectItem>
                  <SelectItem className="text-white" value="medium">Medium</SelectItem>
                  <SelectItem className="text-white" value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exerciseType">Tipo ejercicio</Label>
              <Select>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  <SelectItem className="text-white" value="type1">Type 1</SelectItem>
                  <SelectItem className="text-white" value="type2">Type 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-red hover:bg-redHover">Cargar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </BoxConteiner>
  )
}