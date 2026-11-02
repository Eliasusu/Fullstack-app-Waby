export interface ProgressiveOverload {
    idProgressiveOverload: number;
    name: string;
    logDate: Date;
    typePO: string; // Los tipos pueden ser "weight", "reps" o "secs", en base a eso se sabe a que corresponde el campo done y goal
    done: number;
    goal: number;
    exercise: string;
    user: string;
}