import {YearLevel} from "./Milestone";

export enum TaskType {
  ARTIFACT = 'ARTIFACT',
  COMMENT = 'COMMENT',
  EVENT = 'EVENT'
}

export interface TaskJSON {
  name: string;
  description: string;
  id: number;
  isRequired: boolean;
  yearLevel: YearLevel;
  milestoneID?: number;
  taskType: TaskType;
  artifactName?: string;
  eventId?: number;
  submissionInstructions?: string;
}

export class Task {
  name: string;
  description: string;
  taskID: number;
  isRequired: boolean;
  yearLevel: YearLevel;
  milestoneID?: number;
  taskType: TaskType;
  artifactName?: string;
  eventID?: number;
  submissionInstructions?: string;

  constructor(json: TaskJSON) {
    this.name = json.name;
    this.description = json.description;
    this.taskID = json.id;
    this.isRequired = json.isRequired;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json?.milestoneID;
    this.taskType = json.taskType;
    this.artifactName = json?.artifactName;
    this.eventID = json?.eventId;
    this.submissionInstructions = json?.submissionInstructions;
  }

  needsArtifact(): boolean {
    return this.taskType === TaskType.ARTIFACT;
  }
}
