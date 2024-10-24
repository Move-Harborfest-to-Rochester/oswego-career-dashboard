import { DegreeProgram, DegreeProgramJSON } from "./DegreeProgram";
import { YearLevel } from "./Milestone";

export interface EducationJSON {
  universityId: number;
  year: YearLevel;
  gpa: number;
  minors: DegreeProgramJSON[];
  majors: DegreeProgramJSON[];
}

export default class Education {
  readonly universityId: number;
  readonly year: YearLevel;
  readonly gpa: number;
  readonly majors: DegreeProgram[];
  readonly minors: DegreeProgram[];

  constructor(json: EducationJSON) {
    this.universityId = json.universityId;
    this.year = json.year;
    this.gpa = json.gpa;
    this.minors = json.minors.map(minor => new DegreeProgram(minor));
    this.majors = json.majors.map(major => new DegreeProgram(major));
  }

  static makeEmpty() {
    return new Education({
      universityId: 0,
      year: YearLevel.Freshman,
      gpa: 0,
      minors: [],
      majors: []
    });
  }

  isEmpty(): boolean {
    return this.gpa === 0 && this.majors.length === 0 && this.minors.length === 0;
  }
}
