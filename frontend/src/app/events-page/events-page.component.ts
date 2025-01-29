import {Component, OnInit} from '@angular/core';
import {Event} from "../../domain/Event";
import {EventService} from "../dashboard/events/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {constructBackendRequest, Endpoints} from "../util/http-helper";

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

  ) {}

  ngOnInit() {
    const eventID = Number(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEvents().subscribe((events) => {
      const event = events.find((e) => e.eventID === eventID);
      if (!event) {
        this.router.navigate(['/**']);
      } else {
        this.event = event;
      }
    });
  }

  eventImageUrl(imageId: number | null) {
    if (imageId === null) {
      return 'assets/images/Oswego_logo_horizontal_black.png';
    }
    return constructBackendRequest(`${Endpoints.IMAGE_EVENT}/${imageId}`);
  }

}
