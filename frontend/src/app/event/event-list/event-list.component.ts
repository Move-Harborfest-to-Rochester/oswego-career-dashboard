import {Component, OnInit} from '@angular/core';
import {Event} from "../../../domain/Event";
import {EventService} from "../../homepage/events/event.service";
import {EventList} from "../../homepage/events/event-list";

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.less']
})
export class EventListComponent implements OnInit {
  upcomingEvents: Event[];
  loading: boolean = true;
  currentPage: number = 0;
  lastPageIndex: number = 0;
  private readonly pageSize: number = 10;
  totalItems: number = this.lastPageIndex * this.pageSize;

  constructor(private readonly eventService: EventService) {
    this.upcomingEvents = [];
  }

  ngOnInit() {
    this.eventService.getUpcomingEvents(this.currentPage, this.pageSize).subscribe((eventList: EventList) => {
      console.log(eventList);
      this.totalItems = eventList.totalPages * this.pageSize;
      this.upcomingEvents = eventList.events;
      this.loading = false;
    })
  }
}
