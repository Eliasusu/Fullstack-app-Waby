import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BoxConteiner from "@/components/ui/BoxConteiner.tsx";
import ExercisesTable from "@/exercises/page.tsx";
import { useExercise } from "@/context/ExerciseContext.tsx";
import {useTrainingMethod} from "@/context/TrainingMethodsContext.tsx";


const muscleGroups = ["Legs", "Arms", "Back", "Shoulders", "Chest", "Core"];
const difficultyLevels = ["easy", "medium", "hard"];
const exerciseTypes = ["type1", "type2"]; // Define los tipos que corresponden a tu ejercicio


export default function MuscleGroupExercisesDialog() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const { exercises, getExercises, addExercise } = useExercise();
  const { trainingMethods, getAllTrainingMethods } = useTrainingMethod();

  const [newExercise, setNewExercise] = useState({
    name: "",
    trainingMethod: "",
    description: "",
    muscleGroups: [""] as [string],
    difficulty: "",
    typeExercise: "",
    dateCreated: new Date(),
  });

  useEffect(() => {
    if (openDialog) {
      const fetchExercises = () => {
        try {
          switch (openDialog) {
            case "Legs":
              getExercises("4");
              break;
            case "Arms":
              getExercises("2");
              break;
            case "Back":
              getExercises("3");
              break;
            case "Shoulders":
              getExercises("1");
              break;
            case "Chest":
              getExercises("6");
              break;
            case "Core":
              getExercises("5");
              break;
            default:
              break;
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchExercises();
      const intervalId = setInterval(fetchExercises, 180000);

      return () => clearInterval(intervalId);
}}, [openDialog]);

  useEffect(() => {
    getAllTrainingMethods();
    const intervalId = setInterval(() => {
      getAllTrainingMethods();
    }, 180000); // 3 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  const handleAddExercise = () => {
    addExercise(newExercise);
    setShowAddExercise(false);
  };

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="h-[300px] p-5" padding="my-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Grupos musculares</h2>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-5 m-0 p">
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
        <DialogContent className="bg-grey-bg text-gray-100 min-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Exercises by muscle group</DialogTitle>
          </DialogHeader>
          <h3 className="text-xl font-semibold">{openDialog}</h3>
          <ExercisesTable data={exercises} />
          <button
            className="w-full flex items-center justify-center py-0 text-gray-400 hover:text-gray-100 transition-colors"
            onClick={() => setShowAddExercise(true)}
          >
            <PlusIcon className="mr-2" />
            Add Exercise
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddExercise} onOpenChange={() => setShowAddExercise(false)}>
        <DialogContent className="bg-grey-bg text-gray-100 min-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add an exercise</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddExercise();
            }}
          >
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                className="bg-grey-box border-gray-600 w-full"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="method">Método</Label>
              <Select
                onValueChange={(value) => setNewExercise({ ...newExercise, trainingMethod: value })}
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {trainingMethods.map((method) => (
                    <SelectItem key={method.idMethod} className="text-white" value={method.idMethod}>
                      {method.nameMethod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                className="bg-grey-box border-gray-600 w-full"
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="muscleGroup">Grupo Muscular</Label>
              <Select
                onValueChange={(value) =>
                  setNewExercise({ ...newExercise, muscleGroups: [value] })
                }
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} className="text-white" value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select
                onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} className="text-white" value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exerciseType">Tipo ejercicio</Label>
              <Select
                onValueChange={(value) => setNewExercise({ ...newExercise, typeExercise: value })}
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {exerciseTypes.map((type) => (
                    <SelectItem key={type} className="text-white" value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-red hover:bg-redHover">
              Cargar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </BoxConteiner>
  );
}
