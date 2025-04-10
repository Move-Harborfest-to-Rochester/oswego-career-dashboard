import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Event} from "../../../domain/Event";
import {constructBackendRequest, Endpoints} from 'src/app/util/http-helper';
import {EventList, EventListJSON} from "./event-list";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Gets all events
   */
  getEvents(eventName?: string): Observable<EventList> {
    return this.http.get<EventListJSON>(constructBackendRequest(Endpoints.EVENTS), {
      params: {
        name: eventName ? eventName : ''
      }
    })
      .pipe(map((data: EventListJSON) => {
        return EventList.fromJson(data);
      }))
  }

  getUpcomingEvents(page: number = 0, limit: number = 100): Observable<EventList> {
    const nowUnix = new Date().getTime();
    return this.http.get<EventListJSON>(constructBackendRequest(Endpoints.EVENTS, {
      key: 'startDate',
      value: nowUnix
    }, {
      key: 'page',
      value: page
    }, {
      key: 'limit',
      value: limit
    }))
      .pipe(map((data: EventListJSON) => {
        return EventList.fromJson(data);
      }))
  }

  updateEvent(eventData: any, eventID: number,): Observable<Event> {
    const url = constructBackendRequest(Endpoints.EDIT_EVENT);
    return this.http.post<Event>(url, {eventData, eventID})
      .pipe(map((data: any) => {
        return new Event(data);
      }));
  }

  /**
   * Gets the specific page of events to show on the homepage
   * Currently not implemented on the backend so it acts the same as getEvents()
   */
  getHomepageEvents(page: number, limit: number = 10): Observable<EventList> {
    const pageParam = {key: 'page', value: page};
    const limitParam = {key: 'limit', value: limit};
    return this.http.get<EventListJSON>(constructBackendRequest(Endpoints.HOMEPAGE_EVENTS, pageParam, limitParam))
      .pipe(map((data: EventListJSON) => {
        return EventList.fromJson(data);
      }))
  }

  getEventById(eventID: number): Observable<Event> {
    return this.http.get<Event>(constructBackendRequest(`${Endpoints.EVENTS}/${eventID}`))
      .pipe(map((data: any) => {
        return new Event(data);
      }));
  }
}
