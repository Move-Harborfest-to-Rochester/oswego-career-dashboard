export interface JobJSON{
    id: string;
    name: string;
    location: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    coop: boolean;
    studentDetailsID: string;
}

export class Job{
    constructor(json: JobJSON){
        this.id = json.id;
        this.name = json.name;
        this.location = json.location;
        this.description = json.description;
        this.startDate = new Date(json.startDate);
        this.endDate = json.endDate ? new Date(json.endDate) : null;
        this.isCoop = json.coop;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    location: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    isCoop: boolean;
    studentDetailsID: string;

    static makeEmpty(){
        return new Job({
            id: '',
            name: '',
            location: '',
            description: '',
            startDate: new Date(),
            coop: false,
            studentDetailsID: ''
        })
    }
}
