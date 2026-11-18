/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { X, Edit, Check } from 'lucide-react'
import { CreateTrainingItemSchema, CreateTrainingSchema, UpdateTrainingItemSchema, UpdateTrainingSchema, type Exercise, type TrainingItem } from "@waby/shared"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { useExercise } from "@/exercises/exercise.context.tsx"
import { Calendar } from "@/components/ui/calendar"
import { formatDay, toDateOnly } from "@/lib/dates.ts"
import { notifyErrors, notifyResult } from "@/lib/notify.ts"
import { errorList, numberOrUndefined, validate, type FieldErrors } from "@/lib/validation.ts"
import FieldError from "@/components/FieldError.tsx"

/** Fila editable: los números se editan como texto y se convierten al guardar. */
type ItemDraft = {
  comment: string
  sets: string
  volume: string
  weightKg: string
  restSeconds: string
}

type NewItem = ItemDraft & { exerciseId?: number }

const emptyNewItem: NewItem = { comment: '', sets: '', volume: '', weightKg: '', restSeconds: '' }

const toDraft = (item: TrainingItem): ItemDraft => ({
  comment: item.comment ?? '',
  sets: String(item.sets),
  volume: String(item.reps ?? item.seconds ?? ''),
  weightKg: item.weightKg != null ? String(item.weightKg) : '',
  restSeconds: item.restSeconds != null ? String(item.restSeconds) : '',
})

/**
 * Datos de un ítem para validar y mandar: `reps` o `seconds` según cómo se mide el ejercicio.
 * Un campo vacío queda `undefined` (no 0 ni NaN), así la validación dice que es obligatorio (nota 66).
 */
const itemPayload = (draft: ItemDraft, metricType: Exercise['metricType']) => ({
  sets: numberOrUndefined(draft.sets),
  ...(metricType === 'REPS' ? { reps: numberOrUndefined(draft.volume) } : { seconds: numberOrUndefined(draft.volume) }),
  ...(numberOrUndefined(draft.weightKg) !== undefined ? { weightKg: numberOrUndefined(draft.weightKg) } : {}),
  ...(numberOrUndefined(draft.restSeconds) !== undefined ? { restSeconds: numberOrUndefined(draft.restSeconds) } : {}),
  ...(draft.comment.trim() ? { comment: draft.comment.trim() } : {}),
})

/** `reps` y `seconds` se editan en el mismo campo ("volume"). */
const withVolume = (errors: FieldErrors): FieldErrors => {
  const { reps, seconds, ...rest } = errors
  return { ...rest, ...(reps || seconds ? { volume: reps ?? seconds } : {}) }
}

const itemLabels = { exerciseId: 'Ejercicio', sets: 'Sets', volume: 'Reps / segundos', weightKg: 'Peso', restSeconds: 'Descanso', comment: 'Comentario' }

export const TrainingDay = () => {
  const { training, loadingDay, getTrainingToDay, updateTraining, deleteTraining, addTraining, updateTrainingItem, addTrainingItem, deleteTrainingItem } = useTraining()
  const { allExercises, getAllExercises } = useExercise()

  const [date, setDate] = useState<Date>(new Date())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)

  const [newTrainingName, setNewTrainingName] = useState('')
  const [newTrainingDates, setNewTrainingDates] = useState<Date[]>([])
  const [trainingName, setTrainingName] = useState('')
  const [newItem, setNewItem] = useState<NewItem>(emptyNewItem)
  /** Ítem que se está editando en la tabla y sus valores (nota 65: se guarda ese, no el primero). */
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [itemDraft, setItemDraft] = useState<ItemDraft | null>(null)
  /** Errores por campo de cada formulario (nota 66). */
  const [createErrors, setCreateErrors] = useState<FieldErrors>({})
  const [modifyErrors, setModifyErrors] = useState<FieldErrors>({})
  const [itemErrors, setItemErrors] = useState<FieldErrors>({})

  useEffect(() => {
    getAllExercises()
    getTrainingToDay(date)
  }, [])

  useEffect(() => {
    setTrainingName(training?.name ?? '')
    setEditingItemId(null)
    setItemDraft(null)
  }, [training])

  const newItemExercise = allExercises.find((exercise) => exercise.id === newItem.exerciseId)

  const handleToggleCompleted = async () => {
    if (!training) return
    const result = await updateTraining(training.id, { completed: !training.completed })
    if (!result.ok) notifyErrors(result.errors)
  }

  const handleSubmitUpdateTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!training) return
    const validation = validate(UpdateTrainingSchema, { name: trainingName })
    setModifyErrors(validation.ok ? {} : validation.errors)
    if (!validation.ok) return
    if (notifyResult(await updateTraining(training.id, validation.data), { title: "Cambios guardados", description: "Los cambios se han guardado correctamente." })) {
      setIsModifyDialogOpen(false)
    }
  }

  /** Crea un entrenamiento por cada día elegido en el calendario. */
  const handleSubmitCreateTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // El nombre se valida con el esquema de la API, y además tiene que haber días elegidos (nota 66).
    const validation = validate(CreateTrainingSchema.pick({ name: true }), { name: newTrainingName })
    const errors: FieldErrors = validation.ok ? {} : validation.errors
    if (newTrainingDates.length === 0) errors.days = 'Elegí al menos un día en el calendario'
    setCreateErrors(errors)
    if (Object.keys(errors).length > 0) return
    const results = await Promise.all(newTrainingDates.map((day) => addTraining({ name: newTrainingName.trim(), day: toDateOnly(day) })))
    const failed = results.flatMap((result) => (result.ok ? [] : result.errors))
    if (failed.length) {
      notifyErrors([...new Set(failed)])
      return
    }
    notifyResult({ ok: true, data: undefined }, { title: "Training created", description: "The training has been created successfully." })
    setNewTrainingName('')
    setNewTrainingDates([])
    setIsCreateDialogOpen(false)
    await getTrainingToDay(date)
  }

  const handleToggleItem = async (item: TrainingItem) => {
    if (!training) return
    const result = await updateTrainingItem(training.id, item.id, { completed: !item.completed })
    if (!result.ok) notifyErrors(result.errors)
  }

  const handleChangeItemExercise = async (item: TrainingItem, exercise: Exercise) => {
    if (!training) return
    const result = await updateTrainingItem(training.id, item.id, { exerciseId: exercise.id })
    if (!result.ok) notifyErrors(result.errors)
  }

  const startEditing = (item: TrainingItem) => {
    setEditingItemId(item.id)
    setItemDraft(toDraft(item))
  }

  const handleSubmitUpdateItem = async (item: TrainingItem) => {
    if (!training || !itemDraft) return
    // En la tabla no hay lugar por campo: los errores van al toast, y no se envía nada (nota 66).
    const payload = itemPayload(itemDraft, item.exercise.metricType)
    const volume = 'reps' in payload ? payload.reps : payload.seconds
    const validation = validate(UpdateTrainingItemSchema, payload)
    const errors = withVolume(validation.ok ? {} : validation.errors)
    if (payload.sets === undefined) errors.sets = 'Este campo es obligatorio'
    if (volume === undefined) errors.volume = 'Este campo es obligatorio'
    if (!validation.ok || Object.keys(errors).length > 0) {
      notifyErrors(errorList(errors, itemLabels))
      return
    }
    const result = await updateTrainingItem(training.id, item.id, validation.data)
    if (notifyResult(result, { title: "Exercise updated" })) {
      setEditingItemId(null)
      setItemDraft(null)
    }
  }

  const handleDeleteItem = async (item: TrainingItem) => {
    if (!training) return
    notifyResult(await deleteTrainingItem(training.id, item.id), { title: "Exercise deleted", description: "The exercise has been deleted successfully." })
  }

  const handleSubmitCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!training) return
    const validation = validate(CreateTrainingItemSchema, {
      exerciseId: newItemExercise?.id,
      ...itemPayload(newItem, newItemExercise?.metricType ?? 'REPS'),
    })
    setItemErrors(validation.ok ? {} : withVolume(validation.errors))
    if (!validation.ok) return
    const result = await addTrainingItem(training.id, validation.data)
    if (notifyResult(result, { title: "Exercise added", description: "The exercise has been added successfully." })) {
      setNewItem(emptyNewItem)
      setItemErrors({})
      setIsAddItemDialogOpen(false)
    }
  }

  const handleDeleteTraining = async () => {
    if (!training) return
    notifyResult(await deleteTraining(training.id), { title: "Training deleted", description: "The training has been deleted successfully." })
  }

  const draftInput = (field: keyof ItemDraft, item: TrainingItem, className: string, type: 'text' | 'number' = 'number') => {
    const isEditing = editingItemId === item.id && itemDraft
    return (
      <Input
        type={type}
        disabled={!isEditing}
        value={isEditing ? itemDraft[field] : toDraft(item)[field]}
        onChange={(e) => itemDraft && setItemDraft({ ...itemDraft, [field]: e.target.value })}
        className={className}
      />
    )
  }

  return (
    <BoxContainer width="w-[400px] md:w-[500px] lg:w-[600px]" height="" padding="my-5">
      <h2 className="text-2xl font-semibold text-white m-5">Training</h2>
      <ContextMenu>
        <ContextMenuTrigger>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) setDate(newDate)
            }}
            onDayClick={(day) => getTrainingToDay(day)}
            className="rounded-md shadow"
          />
        </ContextMenuTrigger>
        {training && (
          <ContextMenuContent>
            <ContextMenuItem onClick={handleDeleteTraining}>Delete Training</ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={training?.completed ?? false}
            disabled={!training}
            onClick={handleToggleCompleted}
          />
          <CardTitle className="text-xl font-medium">{loadingDay ? 'Cargando…' : training?.name || 'Sin entrenamiento'}</CardTitle>
        </div>
        <div id="day" className="font-light text-white/75 text-xs">
          <p>{formatDay(date)}</p>
        </div>
      </CardHeader>
      {training?.mesocycle && (
        <div className="ml-5 mb-6">
          <p className="font-normal text-sm text-white-text/70">{training.mesocycle.name}</p>
        </div>
      )}
      <CardContent>
        <div className="border border-white/30 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/20">
                <TableHead className="text-white/90"></TableHead>
                <TableHead className="text-white/90">Exercise</TableHead>
                <TableHead className="text-white/90">Comment</TableHead>
                <TableHead className="text-center text-white/90">Sets</TableHead>
                <TableHead className="text-center text-white/90">Reps / Secs</TableHead>
                <TableHead className="text-center text-white/90">Weight (kg)</TableHead>
                <TableHead className="text-center text-white/90">Rest (s)</TableHead>
                <TableHead className="text-center text-white/90">Delete</TableHead>
                <TableHead className="text-center text-white/90">Modify</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {training?.items.map((item) => (
                <TableRow key={item.id} className="border-b border-white/30">
                  <TableCell className="font-medium text-gray-400">
                    <Checkbox
                      id={`completed-${item.id}`}
                      checked={item.completed}
                      onClick={() => handleToggleItem(item)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-400">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
                          {item.exercise.name}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search exercise..." />
                          <CommandList>
                            <CommandEmpty>No exercise found.</CommandEmpty>
                            <CommandGroup>
                              {allExercises
                                .filter((exercise) => exercise.metricType === item.exercise.metricType)
                                .map((exercise) => (
                                  <CommandItem
                                    key={exercise.id}
                                    onSelect={() => handleChangeItemExercise(item, exercise)}
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
                    {draftInput('comment', item, "bg-grey-box border-gray-600", 'text')}
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    {draftInput('sets', item, "bg-grey-box border-gray-600 w-16 text-center")}
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    {draftInput('volume', item, "bg-grey-box border-gray-600 w-16 text-center")}
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    {draftInput('weightKg', item, "bg-grey-box border-gray-600 w-24 text-center")}
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    {draftInput('restSeconds', item, "bg-grey-box border-gray-600 w-24 text-center")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteItem(item)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {editingItemId === item.id ? (
                      <Button variant="outline" size="icon" className="h-8 w-8 p-0" onClick={() => handleSubmitUpdateItem(item)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="icon" className="h-8 w-8 p-0" onClick={() => startEditing(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Mientras carga el día no se ofrece crear: todavía no se sabe si ya tiene entrenamiento (nota 82). */}
        {loadingDay ? null : training ? (
          <>
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
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
                <form className="grid gap-4 py-4" onSubmit={handleSubmitCreateItem}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="exercise" className="text-right">Exercise</label>
                    <div className="col-span-3">
                      <Select onValueChange={(value) => setNewItem({ ...newItem, exerciseId: Number(value) })}>
                        <SelectTrigger className="">
                          <SelectValue placeholder='Select a exercise' />
                        </SelectTrigger>
                        <SelectContent>
                          {allExercises.map((exercise) => (
                            <SelectItem key={exercise.id} value={exercise.id.toString()}>
                              {exercise.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError message={itemErrors.exerciseId} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="comment" className="text-right">Comment</label>
                    <Input
                      id="comment"
                      value={newItem.comment}
                      onChange={(e) => setNewItem({ ...newItem, comment: e.target.value })}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={itemErrors.comment} /></div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="sets" className="text-right">Sets</label>
                    <Input
                      id="sets"
                      type="number"
                      value={newItem.sets}
                      onChange={(e) => setNewItem({ ...newItem, sets: e.target.value })}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={itemErrors.sets} /></div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="volume" className="text-right">{newItemExercise?.metricType === 'TIME' ? 'Seconds' : 'Reps'}</label>
                    <Input
                      id="volume"
                      type="number"
                      value={newItem.volume}
                      onChange={(e) => setNewItem({ ...newItem, volume: e.target.value })}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={itemErrors.volume} /></div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 ">
                    <label htmlFor="weight" className="text-right">Weight (kg)</label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.5"
                      placeholder="Vacío = peso corporal"
                      value={newItem.weightKg}
                      onChange={(e) => setNewItem({ ...newItem, weightKg: e.target.value })}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={itemErrors.weightKg} /></div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="rest" className="text-right">Rest (s)</label>
                    <Input
                      id="rest"
                      type="number"
                      value={newItem.restSeconds}
                      onChange={(e) => setNewItem({ ...newItem, restSeconds: e.target.value })}
                      className="col-span-3 bg-grey-box border-gray-600 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={itemErrors.restSeconds} /></div>
                  </div>
                  <Button type="submit">Add Exercise</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full text-gray-100 bg-secondary hover:text-gray-200 hover:bg-secondary/40 mt-4"
                >
                  Modify Training
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby="modify-training-description">
                <DialogHeader>
                  <DialogTitle>Modify Training</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4" onSubmit={handleSubmitUpdateTraining}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="trainingName" className="text-right">Name</label>
                    <Input
                      id="trainingName"
                      value={trainingName}
                      onChange={(e) => setTrainingName(e.target.value)}
                      className="col-span-3 w-full" />
                    <div className="col-span-3 col-start-2 -mt-3"><FieldError message={modifyErrors.name} /></div>
                  </div>
                  <Button type="submit" variant={"outline"}>Save Changes</Button>
                </form>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
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
              <form className="grid gap-4 py-4" onSubmit={handleSubmitCreateTraining}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="newTrainingName" className="text-right">Name</label>
                  <Input
                    id='newTrainingName'
                    value={newTrainingName}
                    onChange={(e) => setNewTrainingName(e.target.value)}
                    className="col-span-3 w-full" />
                  <div className="col-span-3 col-start-2 -mt-3"><FieldError message={createErrors.name} /></div>
                </div>
                <div id="conteiner frecuency" className="m-auto text-center w-max h-max">
                  <label htmlFor="frecuency" className="">Frecuency</label>
                  <div className="">
                    <Calendar
                      id="frecuency"
                      selected={newTrainingDates}
                      mode="multiple"
                      onSelect={(dates) => setNewTrainingDates(dates ?? [])}
                      className="col-span-3 w-full"
                    />
                  </div>
                  <FieldError message={createErrors.days} />
                </div>
                <Button type="submit">Create Training</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </BoxContainer>
  )
}
