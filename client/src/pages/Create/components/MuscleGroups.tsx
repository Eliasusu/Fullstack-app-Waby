/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BoxConteiner from "@/components/ui/BoxConteiner.tsx";
import ExercisesTable from "@/exercises/components/exercise-table/page.tsx";
import { useExercise } from "@/exercises/exercise.context.tsx";
import { useTrainingMethod } from "@/trainingMethods/training-method.context.tsx";
import { useMuscleGroup } from "@/muscleGroups/muscle-group.context.tsx";




//const muscleGroups = ["Legs", "Arms", "Back", "Shoulders", "Chest", "Core"];
const difficultyLevels = ["Easy", "Medium", "Hard"];
const exerciseTypes = ["Push", "Pull", "Legs", "Isometric"];


export default function MuscleGroupExercisesDialog() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const { exercises, getExercises, addExercise, getAllExercises } = useExercise();
  const { trainingMethods, getAllTrainingMethods } = useTrainingMethod();
  const { muscleGroups, getAllMGS } = useMuscleGroup();

  const [newExercise, setNewExercise] = useState({
    idExercise: 0,
    name: "",
    trainingMethod: "",
    description: "",
    muscleGroups: [] as number[],
    difficulty: "",
    typeExercise: "",
    //dateCreated: new Date(),
  });

  useEffect(() => {
    getAllMGS();
    const intervalId = setInterval(() => {
      getAllMGS();
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (openDialog) {
      const fetchExercises = () => {
        try {
          switch (openDialog) {
            case "Legs":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Legs") {
                  getExercises(group.idMuscleGroup.toString());
                }
              })
              break;
            case "Arms":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Arms") {
                  getExercises(group.idMuscleGroup.toString());
                }
              });
              break;
            case "Back":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Back") {
                  getExercises(group.idMuscleGroup.toString());
                }
              });
              break;
            case "Shoulders":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Shoulders") {
                  getExercises(group.idMuscleGroup.toString());
                }
              });
              break;
            case "Chest":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Chest") {
                  getExercises(group.idMuscleGroup.toString());
                }
              });
              break;
            case "Core":
              muscleGroups.map((group) => {
                if (group.nameMuscleGroup === "Core") {
                  getExercises(group.idMuscleGroup.toString());
                }
              });
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchExercises();
      const intervalId = setInterval(fetchExercises, 180000);

      return () => clearInterval(intervalId);
    }
  }, [openDialog]);



  useEffect(() => {
    getAllTrainingMethods();
    const intervalId = setInterval(() => {
      getAllTrainingMethods();
    }, 180000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddExercise = () => {
    //Agregar en exercise context un nuevo metodo que
    // Agregue un nuevo ejercicio pero por grupo muscular
    // De esta forma cuando en la tabla se muestren los ejercicios 
    // Seran solo los del grupo muscular seleccionado
    addExercise(newExercise);
    getExercises();
    getAllExercises();
    setShowAddExercise(false);
  };

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="h-[300px] p-5" padding="my-5">
      <h2 className="text-2xl font-medium mb-4 text-gray-100">Grupos musculares</h2>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-5 m-0 p">
        {muscleGroups.map((group) => (
          <Card
            key={group.idMuscleGroup}
            className="bg-gray-box2 h-24 border-white/40 transition-all duration-300 hover:bg-grey-boxActivity hover:scale-105 cursor-pointer"
            onClick={() => setOpenDialog(group.nameMuscleGroup)}
          >
            <CardContent className="p-4 flex items-center justify-center h-24">
              <p className="text-lg font-medium text-gray-100">{group.nameMuscleGroup}</p>
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
                  setNewExercise({ ...newExercise, muscleGroups: [Number(value)] })
                }
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {muscleGroups.map((group) => (
                    <SelectItem key={group.idMuscleGroup} className="text-white" value={group.idMuscleGroup.toString()}>
                      {group.nameMuscleGroup}
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
