export interface ClubJSON{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null ;
    studentDetailsID: string;
}

export class Club{
    constructor(json: ClubJSON){
        this.id = json.id;
        this.name = json.name;
        this.startDate = new Date(json.startDate);
        this.endDate = json.endDate ? new Date(json.endDate) : null;
        this.studentDetailsID = json.studentDetailsID;
    }

    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
    studentDetailsID: string;
}
