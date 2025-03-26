export interface EventJSON {
  endDate: string | null;
  name: string;
  description: string;
  date: string;
  id: number;
  recurring: boolean;
  organizer: string;
  location: string;
  eventLink: string;
  buttonLabel: string;
  photoUrl: string;
}

export class Event {
  name: string;
  description: string;
  date: Date;
  eventID: number;
  isRecurring: boolean;
  organizer: string;
  location: string;
  isComplete: boolean;
  eventLink: string;
  buttonLabel: string;
  photoUrl: string | null;
  endDate: Date | null = null;

  constructor(json: EventJSON) {
    this.name = json.name
    this.description = json.description;
    this.date = new Date(json.date);
    this.endDate = json.endDate ? new Date(json.endDate) : null;
    this.eventID = json.id;
    this.isRecurring = json.recurring;
    this.organizer = json.organizer;
    this.location = json.location;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = false;
    this.eventLink = json.eventLink;
    this.buttonLabel = json.buttonLabel;
    this.photoUrl = json.photoUrl;
  }

  dateAndEndDateAreDifferentDays(): boolean {
    return !this.endDate ||
      this.date.getUTCFullYear() !== this.endDate?.getUTCFullYear() ||
      this.date.getUTCMonth() !== this.endDate?.getUTCMonth() ||
      this.date.getUTCDate() !== this.endDate?.getUTCDate();
  }
}
