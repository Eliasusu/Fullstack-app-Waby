import { CalisthenicsProgressionPerSec } from "./CalisthenicsProgressionPerSec";
import { CalisthenicsProgressionPerRep } from "./CalisthenicsProgressionPerRep";
import { CalisthenicsGoal } from "./calisthenicsGoal";

export class CalisthenicsProgress {
    constructor(
        public calisthenicsGoal: CalisthenicsGoal | null,
        public uploadDate: Date,
        public progressionPerSeg: CalisthenicsProgressionPerSec | null,
        public progressionPerRep: CalisthenicsProgressionPerRep | null,
        public numberSeconds: number | null,
        public numberReps: number | null,
        public numberSets: number,
    ){
        this.uploadDate = Date.now();
    }
    
}