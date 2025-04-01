import {Event, EventJSON} from "./Event";
import {Task, TaskJSON} from "./Task";

export interface MilestoneJSON {
  name: string;
  yearLevel: YearLevel;
  id: number;
  events: Array<EventJSON>;
  tasks: Array<TaskJSON>;
  description: string;
}

export enum YearLevel {
  Freshman = "Freshman",
  Sophomore = "Sophomore",
  Junior = "Junior",
  Senior = "Senior",
  SeniorPlus = "SeniorPlus",
  Graduate = "Graduate",
  Alumni = "Alumni"
}

export namespace YearLevel {

  /**
   * Compares difference between yearLevels.
   * @param y1 first yearLevel
   * @param y2 second yearLevel
   * @return positive if year 1 is greater, 0 if same, negative otherwise
   */
  export function compare(y1: YearLevel, y2: YearLevel): number {
    const enumValues = Object.values(YearLevel);
    const indexA = enumValues.indexOf(y1);
    const indexB = enumValues.indexOf(y2);

    return indexA - indexB;
  }

  export function displayName(level: YearLevel): string {
    if (level === YearLevel.SeniorPlus) {
      return "Senior+";
    }
    return level;
  }
}

export enum CompletionStatus {
  Complete = "Complete",
  InProgress = "In Progress",
  Incomplete = "Incomplete",
  Upcoming = "Upcoming"
}

export class Milestone {
  name: string;
  yearLevel: YearLevel;
  milestoneID: number;
  events: Array<Event>;
  tasks: Array<Task>;
  description?: string;

  constructor(json: MilestoneJSON) {
    this.name = json.name;
    this.yearLevel = json.yearLevel;
    this.milestoneID = json.id;
    this.events = json.events?.map((event) => new Event(event));
    this.tasks = json.tasks?.map((task) => new Task(task));
    this.description = json?.description;
  }
}
