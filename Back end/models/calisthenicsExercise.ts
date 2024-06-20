export class CalisthenicsExercise {
    constructor(
        public idExercise: number,
        public idTraining: number,
        public name: string,
        public trainingMethod: string,
        public description: string,
        public videoUrl: string,
        public image: string,
        public idMuscleGroup: string,
        public difficulty: string,
        public typeExercise: string,
        public date: Date
    ) {}
}