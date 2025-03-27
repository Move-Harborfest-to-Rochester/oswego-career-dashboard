import {Component, OnInit} from '@angular/core';
import {Event} from "../../domain/Event";

import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../homepage/events/event.service";

@Component({
  selector: 'app-events-page-component',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.less']
})
export class EventsPageComponent implements OnInit {
  event!: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const eventID = Number(this.route.snapshot.paramMap.get('id'));

    // this.eventService.getEvents().subscribe((events) => {
    //   const event = events.find((e) => e.eventID === eventID);
    //   if (!event) {
    //     this.router.navigate(['/**']);
    //   } else {
    //     this.event = event;
    //   }
    // });
    this.eventService.getEventById(eventID).subscribe((event) => {
      if (!event) {
        this.router.navigate(['/**'])
      }
      this.event = event;
    })
  }
}
