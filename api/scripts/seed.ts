/**
 * Seed de demo: borra y recrea la base de DESARROLLO y carga datos para recorrer la app.
 *   pnpm --filter @waby/api seed
 *
 * Carga:
 * - Catálogos: 2 métodos de entrenamiento y 6 grupos musculares.
 * - Un admin y un usuario demo (credenciales en .env: SEED_ADMIN_*, SEED_DEMO_*).
 * - Ejercicios del demo, de los dos `metricType`, con progresiones.
 * - Un Mesociclo de 4 semanas que arrancó el lunes de la semana pasada, con Entrenamientos
 *   lunes, miércoles y viernes: los días pasados completados, los futuros pendientes.
 *   Las cargas suben semana a semana (sobrecarga progresiva).
 * - Un Entrenamiento suelto y tres Metas sobre las fechas del Mesociclo.
 *
 * Las fechas se calculan desde hoy, así la demo siempre muestra un Mesociclo en curso.
 */
import { z } from 'zod';
import { mesocycleEndDate, type Difficulty, type MetricType, type MovementPattern } from '@waby/shared';
import { env } from '../shared/env.js';
import { orm } from '../shared/db/orm.js';
import { hashPassword } from '../auth/password.js';
import { User } from '../users/user.entity.js';
import { TrainingMethod } from '../trainingMethods/trainingMethod.entity.js';
import { MuscleGroup } from '../muscleGroups/muscleGroup.entity.js';
import { Exercise } from '../exercises/exercise.entity.js';
import { Progression } from '../progressions/progression.entity.js';
import { Mesocycle } from '../mesocycles/mesocycle.entity.js';
import { Training } from '../trainings/training.entity.js';
import { TrainingItem } from '../trainingItems/trainingItem.entity.js';
import { Goal } from '../goals/goal.entity.js';

if (env.isProd) {
    console.error('El seed borra la base: no se corre con NODE_ENV=production.');
    process.exit(1);
}

const seedEnv = z
    .object({
        SEED_ADMIN_USERNAME: z.string().min(3),
        SEED_ADMIN_EMAIL: z.string().email(),
        SEED_ADMIN_PASSWORD: z.string().min(8),
        SEED_DEMO_USERNAME: z.string().min(3),
        SEED_DEMO_EMAIL: z.string().email(),
        SEED_DEMO_PASSWORD: z.string().min(8),
    })
    .parse(process.env);

// --- Fechas -----------------------------------------------------------------------------

const toDateOnly = (date: Date) => date.toLocaleDateString('sv-SE');
const addDays = (date: Date, days: number) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
};
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayStr = toDateOnly(today);
/** Lunes de la semana pasada. */
const mesocycleStart = addDays(today, -((today.getDay() + 6) % 7) - 7);
const MESOCYCLE_WEEKS = 4;

// --- Seed -------------------------------------------------------------------------------

orm.config.getLogger().setDebugMode(false);
console.log(`Recreando la base "${env.dbName}"...`);
await orm.getSchemaGenerator().refreshDatabase();
const em = orm.em.fork();

// Catálogos
const calisthenics = em.create(TrainingMethod, { name: 'Calistenia', description: 'Entrenamiento con el peso corporal, con o sin lastre' });
const gym = em.create(TrainingMethod, { name: 'Gimnasio', description: 'Entrenamiento con pesas libres y máquinas' });
const groups = Object.fromEntries(
    [
        ['back', 'Espalda', 'Dorsales, trapecio, romboides y lumbares'],
        ['chest', 'Pecho', 'Pectoral mayor y menor'],
        ['arms', 'Brazos', 'Bíceps, tríceps y antebrazos'],
        ['shoulders', 'Hombros', 'Deltoides anterior, lateral y posterior'],
        ['legs', 'Piernas', 'Cuádriceps, isquiotibiales, glúteos y gemelos'],
        ['core', 'Core', 'Abdominales, oblicuos y transverso'],
    ].map(([key, name, description]) => [key, em.create(MuscleGroup, { name, description, image: null })]),
) as Record<'back' | 'chest' | 'arms' | 'shoulders' | 'legs' | 'core', MuscleGroup>;

// Usuarios
em.create(User, {
    username: seedEnv.SEED_ADMIN_USERNAME,
    email: seedEnv.SEED_ADMIN_EMAIL,
    password: await hashPassword(seedEnv.SEED_ADMIN_PASSWORD),
    name: 'Administración Waby',
    birthdate: '1990-01-01',
    phone: null,
    bodyWeightKg: 75,
    heightCm: 175,
    role: 'ADMIN',
});
const demo = em.create(User, {
    username: seedEnv.SEED_DEMO_USERNAME,
    email: seedEnv.SEED_DEMO_EMAIL,
    password: await hashPassword(seedEnv.SEED_DEMO_PASSWORD),
    name: 'Usuario Demo',
    birthdate: '1997-03-14',
    phone: null,
    bodyWeightKg: 74,
    heightCm: 178,
    role: 'USER',
});
demo.trainingMethods.set([calisthenics, gym]);

// Ejercicios del demo
type ExerciseSeed = {
    name: string;
    description: string;
    method: TrainingMethod;
    groups: MuscleGroup[];
    difficulty: Difficulty;
    movementPattern: MovementPattern;
    metricType: MetricType;
};
const exercise = (data: ExerciseSeed) => {
    const created = em.create(Exercise, {
        user: demo,
        name: data.name,
        description: data.description,
        trainingMethod: data.method,
        difficulty: data.difficulty,
        movementPattern: data.movementPattern,
        metricType: data.metricType,
        image: null,
    });
    created.muscleGroups.set(data.groups);
    return created;
};

const pullUps = exercise({ name: 'Dominadas lastradas', description: 'Agarre prono, desde brazos extendidos hasta pasar el mentón. Lastre con cinturón.', method: calisthenics, groups: [groups.back, groups.arms], difficulty: 'MEDIUM', movementPattern: 'PULL', metricType: 'REPS' });
const dips = exercise({ name: 'Fondos en paralelas', description: 'Bajar hasta 90° de codo y empujar hasta bloquear.', method: calisthenics, groups: [groups.chest, groups.arms, groups.shoulders], difficulty: 'MEDIUM', movementPattern: 'PUSH', metricType: 'REPS' });
const pushUps = exercise({ name: 'Flexiones', description: 'Cuerpo en línea, pecho al piso.', method: calisthenics, groups: [groups.chest, groups.arms], difficulty: 'EASY', movementPattern: 'PUSH', metricType: 'REPS' });
const frontLever = exercise({ name: 'Front lever', description: 'Cuerpo horizontal colgado de la barra, brazos extendidos.', method: calisthenics, groups: [groups.back, groups.core], difficulty: 'HARD', movementPattern: 'PULL', metricType: 'TIME' });
const plank = exercise({ name: 'Plancha', description: 'Apoyo en antebrazos, cadera alineada.', method: calisthenics, groups: [groups.core], difficulty: 'EASY', movementPattern: 'CORE', metricType: 'TIME' });
const squat = exercise({ name: 'Sentadilla con barra', description: 'Barra alta, romper el paralelo.', method: gym, groups: [groups.legs, groups.core], difficulty: 'MEDIUM', movementPattern: 'LEGS', metricType: 'REPS' });
const bench = exercise({ name: 'Press de banca', description: 'Agarre medio, tocar el pecho y empujar.', method: gym, groups: [groups.chest, groups.arms, groups.shoulders], difficulty: 'MEDIUM', movementPattern: 'PUSH', metricType: 'REPS' });

// Progresiones
const progressions = (target: Exercise, steps: [name: string, sets: number, volume: number][]) =>
    steps.forEach(([name, sets, volume], index) =>
        em.create(Progression, {
            exercise: target,
            order: index + 1,
            name,
            sets,
            reps: target.metricType === 'REPS' ? volume : null,
            seconds: target.metricType === 'TIME' ? volume : null,
        }),
    );
progressions(frontLever, [
    ['Tuck front lever', 3, 15],
    ['Advanced tuck front lever', 3, 12],
    ['One leg front lever', 3, 10],
    ['Straddle front lever', 3, 8],
    ['Full front lever', 3, 5],
]);
progressions(pullUps, [
    ['Dominadas negativas', 3, 5],
    ['Dominadas con banda', 3, 8],
    ['Dominadas estrictas', 3, 10],
    ['Dominadas con 10 kg', 3, 6],
]);

// Mesociclo con Entrenamientos lunes, miércoles y viernes
const mesocycle = em.create(Mesocycle, {
    user: demo,
    name: 'Bloque de fuerza',
    type: 'STRENGTH',
    startDate: toDateOnly(mesocycleStart),
    weeks: MESOCYCLE_WEEKS,
});

type ItemSeed = { exercise: Exercise; sets: number; reps?: number; seconds?: number; weightKg?: number; restSeconds?: number };
const training = (day: string, name: string, items: ItemSeed[], inMesocycle = true) => {
    const completed = day < todayStr;
    const created = em.create(Training, { user: demo, name, day, completed, mesocycle: inMesocycle ? mesocycle : null });
    for (const item of items) {
        em.create(TrainingItem, {
            training: created,
            exercise: item.exercise,
            sets: item.sets,
            reps: item.reps ?? null,
            seconds: item.seconds ?? null,
            weightKg: item.weightKg ?? null,
            restSeconds: item.restSeconds ?? null,
            comment: null,
            completed,
        });
    }
};

for (let week = 0; week < MESOCYCLE_WEEKS; week++) {
    const monday = addDays(mesocycleStart, week * 7);
    training(toDateOnly(monday), `Tirón · semana ${week + 1}`, [
        { exercise: pullUps, sets: 5, reps: 5, weightKg: 5 + week * 2.5, restSeconds: 180 },
        { exercise: frontLever, sets: 4, seconds: 6 + week * 2, restSeconds: 120 },
        { exercise: plank, sets: 3, seconds: 45 + week * 15, restSeconds: 60 },
    ]);
    training(toDateOnly(addDays(monday, 2)), `Empuje · semana ${week + 1}`, [
        { exercise: dips, sets: 4, reps: 8 + week, restSeconds: 150 },
        { exercise: bench, sets: 5, reps: 5, weightKg: 60 + week * 2.5, restSeconds: 180 },
        { exercise: pushUps, sets: 3, reps: 15 + week * 2, restSeconds: 60 },
    ]);
    training(toDateOnly(addDays(monday, 4)), `Piernas · semana ${week + 1}`, [
        { exercise: squat, sets: 5, reps: 5, weightKg: 80 + week * 5, restSeconds: 180 },
        { exercise: plank, sets: 3, seconds: 60, restSeconds: 60 },
    ]);
}

// Un Entrenamiento suelto, fuera del Mesociclo
training(toDateOnly(addDays(mesocycleStart, -3)), 'Movilidad y técnica', [
    { exercise: pushUps, sets: 3, reps: 12 },
    { exercise: plank, sets: 3, seconds: 40 },
], false);

// Metas sobre las fechas del Mesociclo
const mesocycleEnd = mesocycleEndDate(toDateOnly(mesocycleStart), MESOCYCLE_WEEKS);
const goal = (target: Exercise, targetType: 'REPS' | 'WEIGHT' | 'SECONDS', targetValue: number) =>
    em.create(Goal, { user: demo, exercise: target, targetType, targetValue, startDate: toDateOnly(mesocycleStart), endDate: mesocycleEnd });
goal(pullUps, 'WEIGHT', 12.5);
goal(frontLever, 'SECONDS', 12);
goal(dips, 'REPS', 12);

await em.flush();
await orm.close(true);

console.log(`Listo. Mesociclo "Bloque de fuerza" del ${toDateOnly(mesocycleStart)} al ${mesocycleEnd}.`);
console.log(`  admin: ${seedEnv.SEED_ADMIN_USERNAME}  ·  demo: ${seedEnv.SEED_DEMO_USERNAME}  (contraseñas en .env)`);
