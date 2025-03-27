export interface EventJSON {
  name: string;
  description: string;
  date: string;
  endDate: string | null;
  id: number;
  recurring: boolean;
  organizer: string;
  location: string;
  locationUrl: string;
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
  locationUrl: string;
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
    this.locationUrl = json.locationUrl;
    // TODO this should be checked through the submission object or provided by the backend later
    this.isComplete = false;
    this.eventLink = json.eventLink;
    this.buttonLabel = json.buttonLabel;
    this.photoUrl = json.photoUrl;
  }

  getDateOrRange(): string {
    if (this.endDate && this.dateAndEndDateAreDifferentDays()) {
      return this.date.toLocaleDateString() + " - " + this.endDate.toLocaleDateString();
    }
    return this.date.toLocaleDateString();
  }

  private dateAndEndDateAreDifferentDays(): boolean {
    return !this.endDate ||
      this.date.getUTCFullYear() !== this.endDate?.getUTCFullYear() ||
      this.date.getUTCMonth() !== this.endDate?.getUTCMonth() ||
      this.date.getUTCDate() !== this.endDate?.getUTCDate();
  }
}
