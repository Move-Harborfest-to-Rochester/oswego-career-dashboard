import {Component, OnInit} from '@angular/core';
import {Event} from "../../domain/Event";

import {ActivatedRoute, Router} from "@angular/router";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {EventService} from "../homepage/events/event.service";
import {AuthService} from "../security/auth.service";
import {take} from "rxjs";

@Component({
    selector: 'app-events-page-component',
    templateUrl: './events-page.component.html',
    styleUrls: ['./events-page.component.less']
})
export class EventsPageComponent implements OnInit {
    event!: Event;
    isInterested: boolean = false;
    userId!: string;

    constructor(
        private route: ActivatedRoute,
        private eventService: EventService,
        private authService: AuthService,
        private router: Router
    ) {}

  ngOnInit() {
    const eventID = Number(this.route.snapshot.paramMap.get('id'));

    // Load user info and set userId
    this.authService.loadUser().then(() => {
      this.authService.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          this.userId = user.id;
          console.log("User ID loaded:", this.userId);

          // Fetch event details
          this.eventService.getEvents().subscribe((events) => {
            const event = events.find((e) => e.eventID === eventID);
            if (!event) {
              this.router.navigate(['/**']);
            } else {
              this.event = event;

              //fetch interest status from backend
              this.eventService.getInterestStatus(this.event.eventID, this.userId).subscribe({
                next: (response) => {
                  this.isInterested = response.isInterested;
                  localStorage.setItem(`event-${this.event.eventID}-interest`, JSON.stringify(this.isInterested));
                },
                error: (error) => {
                  console.error("Error fetching interest status:", error);
                  // Fall back to localStorage if API call fails
                  const savedInterest = localStorage.getItem(`event-${this.event.eventID}-interest`);
                  if (savedInterest) {
                    this.isInterested = JSON.parse(savedInterest);
                  }
                }
              });
            }
          });
        } else {
          console.error("User not found. Redirecting to login.");
          this.router.navigate(['/login']);
        }
      });
    }).catch(() => {
      console.error("Failed to load user.");
      this.router.navigate(['/login']);
    });
  }

    eventImageUrl(imageId: number | null) {
        if (imageId === null) {
            return 'assets/images/Oswego_logo_horizontal_green.png';
        }
        return constructBackendRequest(`${Endpoints.IMAGE_EVENT}/${imageId}`);
    }

    toggleInterest(eventID: number, isInterested: boolean) {
      if (!this.userId) {
        console.error("User ID is not available.");
        return;
      }

      localStorage.setItem(`event-${eventID}-interest`, JSON.stringify(isInterested));

      this.eventService.toggleInterest(eventID, this.userId, isInterested).subscribe({
        next: () => {
          console.log("Interest status updated successfully");
          this.isInterested = isInterested;

        },
        error: (error) => {
          console.error("Error updating interest:", error);
        }

      });
    }
}
