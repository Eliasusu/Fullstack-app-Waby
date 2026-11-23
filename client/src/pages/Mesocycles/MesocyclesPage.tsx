import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { CreateMesocycleSchema, type Mesocycle, type MesocycleType } from "@waby/shared";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import FieldError from "@/components/FieldError.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useMesocycles } from "@/mesocycles/mesocycle.context.tsx";
import { formatDay, toDateOnly } from "@/lib/dates.ts";
import { mesocycleTypeLabels, options } from "@/lib/labels.ts";
import { notifyResult } from "@/lib/notify.ts";
import { numberOrUndefined, validate, type FieldErrors } from "@/lib/validation.ts";

type MesocycleDraft = { name: string; type: MesocycleType | ''; startDate: string; weeks: string };

const emptyDraft = (): MesocycleDraft => ({ name: '', type: '', startDate: toDateOnly(new Date()), weeks: '4' });

const toDraft = (mesocycle: Mesocycle): MesocycleDraft => ({
    name: mesocycle.name,
    type: mesocycle.type,
    startDate: mesocycle.startDate,
    weeks: String(mesocycle.weeks),
});

/** Valida con el mismo esquema que la API (nota 66). */
const validateDraft = (draft: MesocycleDraft) =>
    validate(CreateMesocycleSchema, {
        name: draft.name,
        type: draft.type || undefined,
        startDate: draft.startDate,
        weeks: numberOrUndefined(draft.weeks),
    });

const selectClass = "w-full h-10 rounded-md border border-input bg-grey-box px-3 text-sm";

/** Campos de un Mesociclo: se usan en el alta y en la edición. */
function MesocycleForm({ draft, setDraft, errors, submitLabel, onSubmit, onCancel }: {
    draft: MesocycleDraft;
    setDraft: (draft: MesocycleDraft) => void;
    errors: FieldErrors;
    submitLabel: string;
    onSubmit: () => void;
    onCancel?: () => void;
}) {
    const id = useId();
    return (
        <form
            noValidate
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <div className="sm:col-span-2">
                <Label htmlFor={`${id}-name`} className="text-white-text/70">Nombre</Label>
                <Input id={`${id}-name`} placeholder="Bloque de fuerza" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                <FieldError message={errors.name} />
            </div>
            <div>
                <Label htmlFor={`${id}-type`} className="text-white-text/70">Tipo</Label>
                <select id={`${id}-type`} className={selectClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as MesocycleType | '' })}>
                    <option value="">Elegí un tipo</option>
                    {options(mesocycleTypeLabels).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <FieldError message={errors.type} />
            </div>
            <div>
                <Label htmlFor={`${id}-weeks`} className="text-white-text/70">Semanas</Label>
                <Input id={`${id}-weeks`} type="number" min={1} max={52} value={draft.weeks} onChange={(e) => setDraft({ ...draft, weeks: e.target.value })} />
                <FieldError message={errors.weeks} />
            </div>
            <div className="sm:col-span-2">
                <Label htmlFor={`${id}-start`} className="text-white-text/70">Empieza</Label>
                <Input id={`${id}-start`} type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
                <FieldError message={errors.startDate} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" className="flex-1 bg-red hover:bg-redHover">{submitLabel}</Button>
                {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
            </div>
        </form>
    );
}

/**
 * Mesociclos del usuario (nota 78): alta, listado, edición y baja. Cada Mesociclo agrupa
 * Entrenamientos; armarlos es la nota 79.
 */
export default function MesocyclesPage() {
    const { mesocycles, loading, getMesocycles, create, update, remove } = useMesocycles();
    const [newDraft, setNewDraft] = useState<MesocycleDraft>(emptyDraft());
    const [newErrors, setNewErrors] = useState<FieldErrors>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<MesocycleDraft>(emptyDraft());
    const [editErrors, setEditErrors] = useState<FieldErrors>({});
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        getMesocycles();
        // Se carga una vez al entrar a la pantalla.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async () => {
        const validation = validateDraft(newDraft);
        setNewErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        if (notifyResult(await create(validation.data), { title: 'Mesociclo creado', description: validation.data.name })) {
            setNewDraft(emptyDraft());
        }
    };

    const startEditing = (mesocycle: Mesocycle) => {
        setDeletingId(null);
        setEditingId(mesocycle.id);
        setEditDraft(toDraft(mesocycle));
        setEditErrors({});
    };

    const handleUpdate = async (mesocycle: Mesocycle) => {
        const validation = validateDraft(editDraft);
        setEditErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        if (notifyResult(await update(mesocycle.id, validation.data), { title: 'Mesociclo actualizado' })) {
            setEditingId(null);
        }
    };

    const handleDelete = async (mesocycle: Mesocycle) => {
        if (notifyResult(await remove(mesocycle.id), { title: 'Mesociclo borrado', description: mesocycle.name })) {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Header />
            <div className="pb-24 flex flex-col items-center">
                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="my-5 p-5">
                    <h1 className="text-2xl font-semibold text-white-text">Mesociclos</h1>
                    <p className="text-sm text-white-text/70 mb-4">
                        Un Mesociclo es un bloque de varias semanas que agrupa tus Entrenamientos.
                    </p>
                    <MesocycleForm draft={newDraft} setDraft={setNewDraft} errors={newErrors} submitLabel="Crear Mesociclo" onSubmit={handleCreate} />
                </BoxContainer>

                <BoxContainer width="w-full mx-3 max-w-3xl" height="" padding="mb-5 p-5">
                    <h2 className="text-xl font-semibold text-white-text mb-3">Tus Mesociclos</h2>
                    <ul className="flex flex-col gap-3">
                        {mesocycles.length === 0 && (
                            <li className="p-3 text-center text-sm text-white-text/70">
                                {loading ? 'Cargando…' : 'Todavía no tenés Mesociclos. Creá el primero arriba.'}
                            </li>
                        )}
                        {mesocycles.map((mesocycle) => (
                            <li key={mesocycle.id} className="rounded-xl border border-white/30 p-4">
                                {editingId === mesocycle.id ? (
                                    <MesocycleForm
                                        draft={editDraft}
                                        setDraft={setEditDraft}
                                        errors={editErrors}
                                        submitLabel="Guardar"
                                        onSubmit={() => handleUpdate(mesocycle)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-lg font-medium text-white-text">{mesocycle.name}</p>
                                            <p className="text-sm text-white-text/70">
                                                {mesocycleTypeLabels[mesocycle.type]} · {formatDay(mesocycle.startDate)} – {formatDay(mesocycle.endDate)} · {mesocycle.weeks} {mesocycle.weeks === 1 ? 'semana' : 'semanas'}
                                            </p>
                                            <p className="text-sm text-white-text/70">
                                                {mesocycle.trainingsCount} {mesocycle.trainingsCount === 1 ? 'Entrenamiento' : 'Entrenamientos'}
                                            </p>
                                        </div>
                                        {deletingId === mesocycle.id ? (
                                            <div className="flex flex-col gap-2 sm:items-end">
                                                <span className="text-sm">
                                                    ¿Borrar {mesocycle.name}?{mesocycle.trainingsCount > 0 && ' Sus Entrenamientos no se borran: quedan sueltos.'}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Button type="button" className="bg-red hover:bg-redHover" onClick={() => handleDelete(mesocycle)}>Sí, borrar</Button>
                                                    <Button type="button" variant="outline" onClick={() => setDeletingId(null)}>Cancelar</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                {/* El detalle muestra sus Entrenamientos y permite armarlos (nota 79). */}
                                                <Button asChild className="bg-red hover:bg-redHover">
                                                    <Link to={`/mesocycles/${mesocycle.id}`} aria-label={`Ver ${mesocycle.name}`}>Ver</Link>
                                                </Button>
                                                <Button type="button" variant="outline" aria-label={`Editar ${mesocycle.name}`} onClick={() => startEditing(mesocycle)}>Editar</Button>
                                                <Button type="button" variant="outline" aria-label={`Borrar ${mesocycle.name}`} onClick={() => { setEditingId(null); setDeletingId(mesocycle.id); }}>Borrar</Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </BoxContainer>
            </div>
            <NavBar />
        </>
    );
}
