import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EventService} from "./event.service";
import {of} from "rxjs";
import {Event, EventJSON} from "../../../domain/Event";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // If your service makes HTTP requests
      providers: [EventService], // Include the service to be tested
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('events should return list of events', (done) => {
    const eventJSON: EventJSON = {
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
    }

    const events = Array(new Event(eventJSON));
    service.getEvents().subscribe(result => {
      expect(result).toEqual(events);
      done();
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.EVENTS));
    expect(request.request.method).toEqual('GET');
    request.flush(Array(eventJSON))
  });

  it('homepage_events should return list of events', (done) => {
    const eventJSON: EventJSON = {
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
    }

    const events = Array(new Event(eventJSON));

    service.getHomepageEvents(1).subscribe(result => {
      expect(result).toEqual(events);
      done();
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.HOMEPAGE_EVENTS, {key: 'pageNum', value: 1}));

    expect(request.request.method).toEqual('GET');
    request.flush(Array(eventJSON))
  });


})
