import {Component, Input} from '@angular/core';
import {Event} from "../../../domain/Event";
import {Router} from "@angular/router";

@Component({
  selector: 'event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.less']
})
export class EventListItemComponent {
  @Input() event!: Event;

  constructor(private readonly router: Router) {
  }

  async goToEvent() {
    await this.router.navigate(['/events', this.event.eventID]);
  }

  eventDateOrRange() {
    if (this.event.endDate && this.event.dateAndEndDateAreDifferentDays()) {
      return this.event.date.toLocaleDateString() + " - " + this.event.endDate.toLocaleDateString();
    }
    return this.event.date.toLocaleDateString();
  }
}
