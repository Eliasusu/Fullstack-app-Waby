/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import type { CreateExerciseInput, Difficulty, MetricType, MovementPattern, MuscleGroup } from "@waby/shared";
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
import { difficultyLabels, metricTypeLabels, movementPatternLabels, options } from "@/lib/labels.ts";
import { notifyResult } from "@/lib/notify.ts";

type NewExercise = {
  name: string;
  description: string;
  trainingMethodId?: number;
  muscleGroupId?: number;
  difficulty?: Difficulty;
  movementPattern?: MovementPattern;
  metricType?: MetricType;
};

const emptyExercise: NewExercise = { name: "", description: "" };

export default function MuscleGroupExercisesDialog() {
  const [openGroup, setOpenGroup] = useState<MuscleGroup | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const { exercises, getExercises, addExercise } = useExercise();
  const { trainingMethods, getAllTrainingMethods } = useTrainingMethod();
  const { muscleGroups, getAllMGS } = useMuscleGroup();
  const [newExercise, setNewExercise] = useState<NewExercise>(emptyExercise);

  // Los catálogos se cargan una vez: no cambian mientras la pantalla está abierta (nota 89).
  useEffect(() => {
    getAllMGS();
    getAllTrainingMethods();
  }, []);

  // Cualquier grupo muscular, también uno creado por el admin, carga sus ejercicios por id.
  useEffect(() => {
    if (openGroup) getExercises(openGroup.id);
  }, [openGroup]);

  const openAddExercise = () => {
    setNewExercise({ ...emptyExercise, muscleGroupId: openGroup?.id });
    setShowAddExercise(true);
  };

  const handleAddExercise = async () => {
    const { name, description, trainingMethodId, muscleGroupId, difficulty, movementPattern, metricType } = newExercise;
    const data = {
      name,
      ...(description ? { description } : {}),
      trainingMethodId,
      muscleGroupIds: muscleGroupId ? [muscleGroupId] : [],
      difficulty,
      movementPattern,
      metricType,
    } as CreateExerciseInput; // Si falta algo, la API responde 400 con los campos y se muestra en el toast.
    if (notifyResult(await addExercise(data), { title: "Exercise created", description: `${name} was added.` })) {
      setShowAddExercise(false);
    }
  };

  return (
    <BoxConteiner width="w-[400px] md:w-[500px] lg:w-[600px]" height="h-[300px] p-5" padding="my-5">
      <h2 className="text-2xl font-medium mb-4 text-gray-100">Grupos musculares</h2>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-5 m-0 p">
        {muscleGroups.map((group) => (
          <Card
            key={group.id}
            className="bg-gray-box2 h-24 border-white/40 transition-all duration-300 hover:bg-grey-boxActivity hover:scale-105 cursor-pointer"
            onClick={() => setOpenGroup(group)}
          >
            <CardContent className="p-4 flex items-center justify-center h-24">
              <p className="text-lg font-medium text-gray-100">{group.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={openGroup !== null} onOpenChange={() => setOpenGroup(null)}>
        <DialogContent className="bg-grey-bg text-gray-100 min-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Exercises by muscle group</DialogTitle>
          </DialogHeader>
          <h3 className="text-xl font-semibold">{openGroup?.name}</h3>
          <ExercisesTable data={exercises} />
          <button
            className="w-full flex items-center justify-center py-0 text-gray-400 hover:text-gray-100 transition-colors"
            onClick={openAddExercise}
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
              <Select onValueChange={(value) => setNewExercise({ ...newExercise, trainingMethodId: Number(value) })}>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {trainingMethods.map((method) => (
                    <SelectItem key={method.id} className="text-white" value={method.id.toString()}>
                      {method.name}
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
                value={newExercise.muscleGroupId?.toString()}
                onValueChange={(value) => setNewExercise({ ...newExercise, muscleGroupId: Number(value) })}
              >
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {muscleGroups.map((group) => (
                    <SelectItem key={group.id} className="text-white" value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value as Difficulty })}>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {options(difficultyLabels).map((option) => (
                    <SelectItem key={option.value} className="text-white" value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="movementPattern">Patrón de movimiento</Label>
              <Select onValueChange={(value) => setNewExercise({ ...newExercise, movementPattern: value as MovementPattern })}>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Select movement pattern" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {options(movementPatternLabels).map((option) => (
                    <SelectItem key={option.value} className="text-white" value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="metricType">Se mide por</Label>
              <Select onValueChange={(value) => setNewExercise({ ...newExercise, metricType: value as MetricType })}>
                <SelectTrigger className="bg-grey-box border-gray-600">
                  <SelectValue placeholder="Repeticiones o tiempo" />
                </SelectTrigger>
                <SelectContent className="bg-grey-boxRoutine">
                  {options(metricTypeLabels).map((option) => (
                    <SelectItem key={option.value} className="text-white" value={option.value}>
                      {option.label}
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
