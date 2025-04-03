import {Event, EventJSON} from "../../../domain/Event";

export interface EventListJSON {
  events: EventJSON[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export class EventList {
  events: Event[];
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(events: Event[], page: number, pageSize: number, totalPages: number) {
    this.events = events;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
  }

  static fromJson(data: EventListJSON): EventList {
    return new EventList(
      data.events.map((data: EventJSON) => new Event(data)),
      data.page,
      data.pageSize,
      data.totalPages);
  }
}
