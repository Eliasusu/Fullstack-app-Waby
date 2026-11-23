import { useId, useState } from "react";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import FieldError from "@/components/FieldError.tsx";
import { validate, type FieldErrors } from "@/lib/validation.ts";

/** Elemento de un catálogo (Grupo muscular, Método de entrenamiento). */
export type CatalogItem = { id: number; name: string; description: string };
export type CatalogValues = { name: string; description: string };

export interface CatalogEditorProps {
    /** Input: título de la sección. */
    title: string;
    /** Input: elementos a mostrar. */
    items: CatalogItem[];
    /** Input: mientras carga se muestra "Cargando…" en vez de la lista vacía. */
    loading?: boolean;
    /** Input: reglas de @waby/shared para validar antes de avisar al padre (nota 66). */
    schema: ZodType<CatalogValues>;
    /** Output: el usuario pidió crear un elemento. Devuelve si se guardó, para limpiar el form. */
    onCreate: (values: CatalogValues) => Promise<boolean>;
    /** Output: el usuario pidió guardar cambios en un elemento. */
    onUpdate: (id: number, values: CatalogValues) => Promise<boolean>;
    /** Output: el usuario confirmó borrar un elemento. */
    onDelete: (item: CatalogItem) => Promise<boolean>;
}

const empty: CatalogValues = { name: '', description: '' };

/**
 * Lista editable de un catálogo (notas 77 y 84). Es un componente de presentación: no conoce la API
 * ni los contextos. Recibe los datos por props (input) y avisa al padre por callbacks (output),
 * así sirve para los dos catálogos y se puede testear sin simular la API.
 */
export default function CatalogEditor({ title, items, loading = false, schema, onCreate, onUpdate, onDelete }: CatalogEditorProps) {
    const id = useId();
    const [newValues, setNewValues] = useState<CatalogValues>(empty);
    const [newErrors, setNewErrors] = useState<FieldErrors>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<CatalogValues>(empty);
    const [editErrors, setEditErrors] = useState<FieldErrors>({});
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = validate(schema, newValues);
        setNewErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        if (await onCreate(validation.data)) setNewValues(empty);
    };

    const startEditing = (item: CatalogItem) => {
        setDeletingId(null);
        setEditingId(item.id);
        setEditValues({ name: item.name, description: item.description });
        setEditErrors({});
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, item: CatalogItem) => {
        e.preventDefault();
        const validation = validate(schema, editValues);
        setEditErrors(validation.ok ? {} : validation.errors);
        if (!validation.ok) return;
        if (await onUpdate(item.id, validation.data)) setEditingId(null);
    };

    const handleDelete = async (item: CatalogItem) => {
        if (await onDelete(item)) setDeletingId(null);
    };

    return (
        <section aria-labelledby={`${id}-title`} className="flex flex-col gap-3">
            <h2 id={`${id}-title`} className="text-xl font-semibold text-white-text">{title}</h2>

            <form onSubmit={handleCreate} noValidate className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] sm:items-start">
                <div>
                    <Label htmlFor={`${id}-name`} className="text-white-text/70">Nombre</Label>
                    <Input id={`${id}-name`} value={newValues.name} onChange={(e) => setNewValues({ ...newValues, name: e.target.value })} />
                    <FieldError message={newErrors.name} />
                </div>
                <div>
                    <Label htmlFor={`${id}-description`} className="text-white-text/70">Descripción</Label>
                    <Input id={`${id}-description`} value={newValues.description} onChange={(e) => setNewValues({ ...newValues, description: e.target.value })} />
                    <FieldError message={newErrors.description} />
                </div>
                <Button type="submit" className="sm:mt-6 bg-red hover:bg-redHover">Agregar</Button>
            </form>

            <ul className="flex flex-col divide-y divide-white/20 border border-white/30 rounded-xl">
                {items.length === 0 && (
                    <li className="p-3 text-center text-sm text-white-text/70">{loading ? 'Cargando…' : 'Todavía no hay elementos.'}</li>
                )}
                {items.map((item) => (
                    <li key={item.id} className="p-3">
                        {editingId === item.id ? (
                            <form onSubmit={(e) => handleUpdate(e, item)} noValidate className="grid gap-2 sm:grid-cols-[1fr_2fr_auto_auto] sm:items-start">
                                <div>
                                    <Label htmlFor={`${id}-edit-name`} className="text-white-text/70">Nombre</Label>
                                    <Input id={`${id}-edit-name`} value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                                    <FieldError message={editErrors.name} />
                                </div>
                                <div>
                                    <Label htmlFor={`${id}-edit-description`} className="text-white-text/70">Descripción</Label>
                                    <Input id={`${id}-edit-description`} value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })} />
                                    <FieldError message={editErrors.description} />
                                </div>
                                <Button type="submit" className="sm:mt-6">Guardar</Button>
                                <Button type="button" variant="outline" className="sm:mt-6" onClick={() => setEditingId(null)}>Cancelar</Button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-white-text">{item.name}</p>
                                    <p className="text-sm text-white-text/70">{item.description}</p>
                                </div>
                                {deletingId === item.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">¿Borrar {item.name}?</span>
                                        <Button type="button" className="bg-red hover:bg-redHover" onClick={() => handleDelete(item)}>Sí, borrar</Button>
                                        <Button type="button" variant="outline" onClick={() => setDeletingId(null)}>Cancelar</Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" aria-label={`Editar ${item.name}`} onClick={() => startEditing(item)}>Editar</Button>
                                        <Button type="button" variant="outline" aria-label={`Borrar ${item.name}`} onClick={() => { setEditingId(null); setDeletingId(item.id); }}>Borrar</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
