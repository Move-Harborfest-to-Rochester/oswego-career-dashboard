import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {EventService} from "./event.service";
import {Event, EventJSON} from "../../../domain/Event";
import {constructBackendRequest, Endpoints} from 'src/app/util/http-helper';
import {EventListJSON} from "./event-list";

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
      photoUrl: "https://example.com/image.jpg",
      locationUrl: "https://example.com/location",
      endDate: new Date().toDateString(),
    }

    const events = Array(new Event(eventJSON));
    service.getEvents().subscribe(result => {
      expect(result.events).toEqual(events);
      done();
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.EVENTS, {
      key: 'name',
      value: ''
    }));
    expect(request.request.method).toEqual('GET');
    const response: EventListJSON = {
      events: [eventJSON],
      page: 1,
      pageSize: 10,
      totalPages: 1
    };
    request.flush(response);
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
      photoUrl: "https://example.com/image.jpg",
      locationUrl: "https://example.com/location",
      endDate: new Date().toDateString(),
    };

    const events = Array(new Event(eventJSON));

    service.getHomepageEvents(0).subscribe(result => {
      expect(result.events).toEqual(events);
      done();
    });
    const request = httpMock.expectOne(constructBackendRequest(Endpoints.HOMEPAGE_EVENTS, {
      key: 'page',
      value: 0
    }, {
      key: 'limit',
      value: 10
    }));

    expect(request.request.method).toEqual('GET');
    const response: EventListJSON = {
      events: [eventJSON],
      page: 1,
      pageSize: 10,
      totalPages: 1
    };
    request.flush(response);
  });


})
