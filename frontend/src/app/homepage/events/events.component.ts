import {Component, OnInit} from '@angular/core';
import {EventService} from "./event.service";
import {Event} from "../../../domain/Event";
import {Router} from "@angular/router";
import {EventList} from "./event-list";
import {ScreenSizeService} from "../../util/screen-size.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {
  slides: any[] = [];
  defaultLogoURL = '/assets/images/Oswego_logo_horizontal_black.png';
  loading: boolean = true;
  protected readonly Math = Math;

  constructor(
    private eventService: EventService,
    private router: Router,
    private screenSizeSvc: ScreenSizeService,
  ) {
  }

  get itemsPerSlide$(): Observable<number> {
    return this.screenSizeSvc.screenSize$.pipe(map(screenWidth => {
      if (screenWidth < 600) {
        return 1;
      } else if (screenWidth < 1000) {
        return 2;
      } else {
        return 4;
      }
    }));
  }

  ngOnInit() {
    // TODO fire every tie carosel gets close to the end to get next page once backend is implement for this
    this.eventService.getHomepageEvents(0, Math.min(100, 50)).subscribe((eventList: EventList) => {
      this.slides = eventList.events.map((event: Event) => {
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
          eventLink: event.eventLink,
          dateRange: event.getDateOrRange()
        }
      });

      this.loading = false;
    });
  }

  goToLink(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
}
