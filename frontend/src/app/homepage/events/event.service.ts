import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Event, EventJSON} from "../../../domain/Event";
import {constructBackendRequest, Endpoints} from 'src/app/util/http-helper';

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
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.EVENTS))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
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
  getHomepageEvents(page: number): Observable<Event[]> {
    const pageParam = {key: 'page', value: page};
    const limitParam = {key: 'limit', value: 10};
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.HOMEPAGE_EVENTS, pageParam, limitParam))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }
}
