import {Component, Input} from '@angular/core';
import {Event} from "../../../domain/Event";

@Component({
  selector: 'event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.less']
})
export class EventListItemComponent {
  @Input() event!: Event;

  constructor() {
  }

  goToEvent() {
    window.open(this.event.eventLink, "_blank");
  }

  eventDate() {
    return this.event.date.toLocaleDateString();
  }
}
