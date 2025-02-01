import {Component, OnInit} from '@angular/core';
import {Event} from "../../../domain/Event";
import {EventService} from "../../homepage/events/event.service";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent implements OnInit {
  events: Event[];

  constructor(private readonly eventService: EventService) {
    this.events = [];
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    })
  }
}
