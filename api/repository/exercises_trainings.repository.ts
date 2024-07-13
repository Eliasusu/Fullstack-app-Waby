import {Routine} from '../entity/exercise_training.entity.js';
import {Repository} from '../shared/repository.js';
import {Training} from '../entity/training.entity.js';
import {Mesocycle} from '../entity/mesocycle.entity.js';
import {User} from '../entity/user.entity.js';
import {TrainingMethod} from '../entity/trainingMethod.entity.js';
import {Exercise} from '../entity/exercise.entity.js';
import {MuscleGroup} from '../entity/muscleGroup.entity.js';
import { PassThrough } from 'stream';

const Routines = [
    new Routine(
        new Training(
        new User(
            "Nobara",
            "1234",
            "nobarakugisaki@gmail.com",
            "Nobara Kugisaki",
            new Date(2002, 20, 12),
            "123456",
            50,
            1.60,
            new TrainingMethod(
                "Gym",
                ""
            )
        ),
        new Mesocycle(
            "1",
            "Strenght",
            new Date(),
            new Date()
        ),
        "Chest day",
        "Pull",
        new Date(),
        "5:00 AM",
        "1"
    ), 
        new Exercise(
        "Bench Press",
        new TrainingMethod("Gym", ""),
        "The bench press is a compound exercise that builds strength and muscle in the chest and triceps. It's one of the most popular exercises in the gym.",
        [new MuscleGroup("1", "Chest", "", "")],
        "Medium",
        "Compound",
        "1",
        new Training(
            new User(
                "theo", 
                "1234", 
                "theo@gmail.com", 
                "Theo", 
                new Date(), 
                "123456", 
                70, 
                1.80, 
                new TrainingMethod(
                    "Gym",
                    ""
                )
            ),
            new Mesocycle(
                "1", 
                "Strenght",
                 new Date(), 
                 new Date()), 
                 "Chest day", 
                 "Pull", 
                 new Date(), 
                 "5:00 AM",
             ),
        "",
        "",
        new Date()
        
    ),
        3,
        10,
        10,
        60,
        'Comentario de la rutina 1',
    )
]

export class RoutineRepository implements Repository<Routine>{
    public async getAll(): Promise<Routine[] | undefined> {
        return Routines;
    }

    public async getOne(item: { id?: string,id?: string}): Promise<Routine | undefined> {
      if (item.id) {
          return Routines.find((routine) => //Aca tendria q buscar usando base de datos
      } else if (item.name) {
          return Routines.find((routine) => //Aca tendria q buscar usando base de datos
      } else {return undefined;}
    }

    public async add(item: Routine): Promise<Routine | undefined> {
    
        Routines.push(item);
        return undefined;
    }

    public async update(item: Routine): Promise<Routine | undefined> {
      const routine = Routines.find((routine) => // Aca tendria q buscar usando base de datos
      if (!routine) {
            console.log('Routine not found');
            return;
        }
        Object.assign(routine, item);
        return routine;
    }

   public async delete(item: { id?: string, name?: string }): Promise<Routine | undefined> {
        if( item.id ){
            const index = Routines.findIndex((routine) => // Aca tendria q buscar usando base de datos
            if (index > -1) {
                return Routines.splice(index, 1)[0];
            } else {
                return;
            }
        } else {
            const index = Routines.findIndex((routine) => routine.nameRoutine === item.name);
            if (index > -1) {
                return Routines.splice(index, 1)[0];
            } else {
                return;