import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { CreateTrainingSchema, type Mesocycle, type Training } from "@waby/shared";
import Header from "@/components/Header.tsx";
import NavBar from "@/components/NavBar.tsx";
import FieldError from "@/components/FieldError.tsx";
import BoxContainer from "@/components/ui/BoxConteiner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { getMesocycleReq, getMesocycleTrainingsReq } from "@/mesocycles/mesocycle.api.ts";
import { useMesocycles } from "@/mesocycles/mesocycle.context.tsx";
import { useTraining } from "@/trainings/training.context.tsx";
import { getErrorMessages } from "@/lib/api-error.ts";
import { formatDay, fromDateOnly, toDateOnly } from "@/lib/dates.ts";
import { mesocycleTypeLabels } from "@/lib/labels.ts";
import { notifyErrors, notifyResult } from "@/lib/notify.ts";
import { validate, type FieldErrors } from "@/lib/validation.ts";
import { boxWidth } from "@/lib/layout.ts";

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

/**
 * Detalle de un Mesociclo y armado de su rutina (nota 79): sus Entrenamientos, y un form para
 * agregarle Entrenamientos en días dentro de su rango. Los Ítems de cada Entrenamiento se cargan
 * en el calendario ("Ver en el calendario"). Los Ítems que se completen son los que mueven las
 * Metas del mismo Ejercicio en esas fechas: es la relación entre los dos CU (nota 40).
 */
export default function MesocycleDetailPage() {
    const id = Number(useParams().id);
    const { getMesocycles } = useMesocycles();
    const { addTraining } = useTraining();
    const [mesocycle, setMesocycle] = useState<Mesocycle | null>(null);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [state, setState] = useState<LoadState>('loading');
    const [name, setName] = useState('');
    const [days, setDays] = useState<Date[]>([]);
    const [errors, setErrors] = useState<FieldErrors>({});

    /** Recarga el Mesociclo (con su cantidad de Entrenamientos) y sus Entrenamientos. */
    const load = useCallback(async () => {
        try {
            const [mesocycleRes, trainingsRes] = await Promise.all([getMesocycleReq(id), getMesocycleTrainingsReq(id)]);
            setMesocycle(mesocycleRes.data);
            setTrainings(trainingsRes.data);
            setState('ready');
        } catch (error) {
            // Un Mesociclo de otro usuario responde 404, igual que uno que no existe.
            if (isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
                setState('not-found');
                return;
            }
            setState('error');
            notifyErrors(getErrorMessages(error));
        }
    }, [id]);

    useEffect(() => {
        load();
    }, [load]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!mesocycle) return;
        const validation = validate(CreateTrainingSchema.pick({ name: true }), { name });
        const formErrors: FieldErrors = validation.ok ? {} : validation.errors;
        if (days.length === 0) formErrors.days = 'Elegí al menos un día del Mesociclo';
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) return;

        const results = await Promise.all(
            days.map((day) => addTraining({ name: name.trim(), day: toDateOnly(day), mesocycleId: mesocycle.id })),
        );
        const failed = results.flatMap((result) => (result.ok ? [] : result.errors));
        if (failed.length > 0) notifyErrors([...new Set(failed)]);
        const created = results.length - results.filter((result) => !result.ok).length;
        if (created > 0) {
            notifyResult({ ok: true, data: undefined }, {
                title: created === 1 ? 'Entrenamiento agregado' : `${created} Entrenamientos agregados`,
                description: mesocycle.name,
            });
            setName('');
            setDays([]);
        }
        // La cantidad de Entrenamientos es derivada: se recarga el detalle y el listado de Mesociclos.
        await Promise.all([load(), getMesocycles()]);
    };

    if (state === 'not-found' || state === 'error') {
        return (
            <>
                <Header />
                <div className="pb-24 flex justify-center">
                    <BoxContainer width={boxWidth} height="" padding="my-5 p-5">
                        <p className="text-white-text">
                            {state === 'not-found' ? 'Este Mesociclo no existe o no es tuyo.' : 'No se pudo cargar el Mesociclo.'}
                        </p>
                        <Link to="/mesocycles" className="mt-3 inline-block underline">Volver a Mesociclos</Link>
                    </BoxContainer>
                </div>
                <NavBar />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="pb-24 flex flex-col items-center">
                <BoxContainer width={boxWidth} height="" padding="my-5 p-5">
                    <Link to="/mesocycles" className="text-sm text-white-text/70 underline">← Mesociclos</Link>
                    {mesocycle ? (
                        <>
                            <h1 className="mt-2 text-2xl font-semibold text-white-text">{mesocycle.name}</h1>
                            <p className="text-sm text-white-text/70">
                                {mesocycleTypeLabels[mesocycle.type]} · {formatDay(mesocycle.startDate)} – {formatDay(mesocycle.endDate)} · {mesocycle.weeks} {mesocycle.weeks === 1 ? 'semana' : 'semanas'}
                            </p>
                            <p className="mt-1 font-medium text-white-text">
                                {mesocycle.trainingsCount} {mesocycle.trainingsCount === 1 ? 'Entrenamiento' : 'Entrenamientos'}
                            </p>
                        </>
                    ) : (
                        <p className="mt-2 text-white-text/70">Cargando…</p>
                    )}
                </BoxContainer>

                <BoxContainer width={boxWidth} height="" padding="mb-5 p-5">
                    <h2 className="text-xl font-semibold text-white-text mb-3">Entrenamientos</h2>
                    <ul className="flex flex-col divide-y divide-white/20 rounded-xl border border-white/30">
                        {trainings.length === 0 && (
                            <li className="p-3 text-center text-sm text-white-text/70">
                                {state === 'loading' ? 'Cargando…' : 'Este Mesociclo todavía no tiene Entrenamientos. Agregalos abajo.'}
                            </li>
                        )}
                        {trainings.map((training) => (
                            <li key={training.id} className="flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-white-text">{training.name}</p>
                                    <p className="text-sm text-white-text/70">
                                        {formatDay(training.day)}{training.completed ? ' · Completado' : ''}
                                    </p>
                                </div>
                                <Link to={`/calendar?date=${training.day}`} className="text-sm underline">
                                    Ver en el calendario
                                </Link>
                            </li>
                        ))}
                    </ul>
                </BoxContainer>

                {mesocycle && (
                    <BoxContainer width={boxWidth} height="" padding="mb-5 p-5">
                        <h2 className="text-xl font-semibold text-white-text">Agregar Entrenamientos</h2>
                        <p className="text-sm text-white-text/70 mb-3">
                            Elegí uno o más días dentro del Mesociclo. Después cargale los ejercicios a cada uno desde el calendario.
                        </p>
                        <form onSubmit={handleAdd} noValidate className="flex flex-col gap-3">
                            <div>
                                <Label htmlFor="mesocycle-training-name" className="text-white-text/70">Nombre</Label>
                                <Input id="mesocycle-training-name" placeholder="Empuje" value={name} onChange={(e) => setName(e.target.value)} />
                                <FieldError message={errors.name} />
                            </div>
                            <div>
                                <p className="text-sm text-white-text/70">Días</p>
                                <Calendar
                                    mode="multiple"
                                    selected={days}
                                    onSelect={(selected) => setDays(selected ?? [])}
                                    defaultMonth={fromDateOnly(mesocycle.startDate)}
                                    fromDate={fromDateOnly(mesocycle.startDate)}
                                    toDate={fromDateOnly(mesocycle.endDate)}
                                />
                                <FieldError message={errors.days} />
                            </div>
                            <Button type="submit" className="bg-red hover:bg-redHover">
                                {days.length > 1 ? `Agregar ${days.length} Entrenamientos` : 'Agregar Entrenamiento'}
                            </Button>
                        </form>
                    </BoxContainer>
                )}
            </div>
            <NavBar />
        </>
    );
}
