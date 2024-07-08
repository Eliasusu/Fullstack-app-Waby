import { Request, Response } from 'express';
import { TrainingMethod } from '../entity/trainingMethod.entity.js';
import { Exercise } from '../entity/exercise.entity.js';
import { MuscleGroup } from '../entity/muscleGroup.entity.js';
import { Training } from '../entity/training.entity.js';


export function exercisesSanitize (input: Request){
    input.body = {
        name: input.body.name,
        trainingMethod: new TrainingMethod(input.body.trainingMethod.name, input.body.trainingMethod.description),
        description: input.body.description,
        muscleGroups: [new MuscleGroup(input.body.muscleGroups.id, input.body.muscleGroups.name, input.body.muscleGroups.description, input.body.muscleGroups.image)],
        difficulty: input.body.difficulty,
        typeExercise: input.body.typeExercise,
        training: new Training(input.body.training.idTraining, input.body.training.user, input.body.training.mesocycle, input.body.training.trainingName, input.body.training.trainingType, new Date(input.body.training.day), input.body.training.time),
        videoUrl: input.body.videoUrl,
        image: input.body.image,
        dateCreated: new Date(input.body.dateCreated)
    }

    return input.body as Exercise;
}