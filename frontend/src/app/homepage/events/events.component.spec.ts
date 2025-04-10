import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EventsComponent} from './events.component';
import {MatCardModule} from "@angular/material/card";
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {Event} from "../../../domain/Event";
import {EventService} from "./event.service";
import {of} from "rxjs";
import {MockModule} from 'ng-mocks';
import {ArtifactService} from "../../file-upload/artifact.service";

const createSpyObj = jasmine.createSpyObj;

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents', 'getHomepageEvents']);
  let artifactServiceSpy = createSpyObj('ArtifactService', ['getEvents', 'getHomepageEvents']);
  eventServiceSpy.getEvents.and.returnValue(of(Array(new Event({
    name: "name",
    description: "description",
    date: new Date().toDateString(),
    id: 1,
    recurring: true,
    organizer: "organizer",
    location: "location",
    eventLink: "sample link",
    buttonLabel: "test",
    photoUrl: "https://example.com/image.jpg",
    locationUrl: "https://example.com/location",
    endDate: new Date().toDateString(),
  }))));

  eventServiceSpy.getHomepageEvents.and.returnValue(of(Array(new Event({
    name: "name",
    description: "description",
    date: new Date().toDateString(),
    id: 2,
    recurring: true,
    organizer: "organizer",
    location: "location",
    eventLink: "sample link",
    buttonLabel: "test",
    photoUrl: "https://example.com/image.jpg",
    locationUrl: "https://example.com/location",
    endDate: new Date().toDateString(),
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MockModule(CarouselModule)],
      providers: [
        {provide: EventService, useValue: eventServiceSpy},
        {provide: ArtifactService, useValue: artifactServiceSpy},
      ],
      declarations: [EventsComponent]
    });
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
