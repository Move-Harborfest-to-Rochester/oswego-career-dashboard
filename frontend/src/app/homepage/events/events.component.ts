import {Component, OnInit} from '@angular/core';
import {EventService} from "./event.service";
import {Event} from "../../../domain/Event";
import {ArtifactService} from "../../file-upload/artifact.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {

  itemsPerSlide = 4; //animation only appears when there is 1 item
  slides: any[] = [];
  singleSlideOffset = false;
  noWrap = false;
  eventPage: number = 0;
  defaultLogoURL = '/assets/images/Oswego_logo_horizontal_black.png';
  events: Array<Event> = []

  constructor(
    private eventService: EventService,
    private artifactService: ArtifactService,
    private router: Router,
    //private readonly socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit() {
    // const isMobile = navigator.userAgent; //only display one event per page on mobile
    // start with only the first page of events
    // TODO fire every tie carosel gets close to the end to get next page once backend is implement for this
    this.eventService.getHomepageEvents(1).subscribe((events: Event[]) => {
      this.events = events;

      this.slides = events.map((event: Event) => {
        let imgUrl = this.defaultLogoURL;  //placeholder
        if (event.photoUrl != null) {
          imgUrl = event.photoUrl
        }
        return {
          id: event.eventID,
          name: event.name,
          date: event.date.toLocaleString('en-us', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }),
          description: event.description,
          img: imgUrl,
          buttonLabel: event.buttonLabel,
          eventLink: event.eventLink
        }
      })
    });
  }

  goToLink(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }

}
