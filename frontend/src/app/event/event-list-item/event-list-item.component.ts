import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../../domain/Event";
import {ArtifactService} from 'src/app/file-upload/artifact.service';

@Component({
  selector: 'event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.less']
})
export class EventListItemComponent implements OnInit {
  @Input() event!: Event;
  imageUrl?: string;

  constructor(private readonly artifactService: ArtifactService) {}

  ngOnInit() {
    if (this.event.imageId == null) return;
    this.imageUrl = this.artifactService.getEventImageUrl(this.event.imageId);
  }

  goToEvent() {
    window.open(this.event.eventLink, "_blank");
  }

  eventDate() {
    return this.event.date.toLocaleDateString();
  }
}
