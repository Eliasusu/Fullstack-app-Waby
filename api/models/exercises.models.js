import  exercisesData  from '../datos temporales/exercises.json' assert  { type: "json" };
const exercises = exercisesData;


export class ExerciseModel {

    static async getAll ({ nameMuscleGroup }){
        if(nameMuscleGroup){
            const filteredExercises = exercises.filter(
                w => w.muscleGroups.find((m) => m.nameMuscleGroup === nameMuscleGroup));
            if (filteredExercises.length > 0){
                return filteredExercises;
            }else {
                 console.log('Exercises not found');
            }
        }else{
            return exercises;
        }

    }

    static async getById (idExercise){
        const exercise = exercises.find((w) => w.idExercise === idExercise);
        if (exercise){
            return exercise;
        }else{
            console.log('Exercise not found');
        }
    }

    static async create (exercise){
        exercise.idExercise = (exercises.length + 1).toString();
        exercises.push(exercise);
        return exercise;
    }

    static async update (id ,data){
        const exercise = exercises.find((w) => w.idExercise === id);
        Object.assign(exercise, data);
        return exercise;
    }

    static async delete (idExercise){
        const index = exercises.findIndex((w) => w.idExercise === idExercise);
        if (index > -1){
            exercises.splice(index, 1);
            return true;
        }else{
            return false;
        }

    }

}
