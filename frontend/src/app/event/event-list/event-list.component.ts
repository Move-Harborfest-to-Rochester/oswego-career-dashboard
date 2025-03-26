import {Component, OnInit} from '@angular/core';
import {Event} from "../../../domain/Event";
import {EventService} from "../../homepage/events/event.service";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent implements OnInit {
  upcomingEvents: Event[];

  constructor(private readonly eventService: EventService) {
    this.upcomingEvents = [];
  }

  ngOnInit() {
    this.eventService.getUpcomingEvents().subscribe((events: Event[]) => {
      this.upcomingEvents = events
        .sort((this.sortByDateAscending));
    })
  }

  private sortByDateAscending(event1: Event, event2: Event) {
    return event1.date.getTime() - event2.date.getTime();
  }
}
