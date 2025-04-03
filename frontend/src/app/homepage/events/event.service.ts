import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Event, EventJSON} from "../../../domain/Event";
import { Endpoints, constructBackendRequest } from 'src/app/util/http-helper';

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
  getHomepageEvents(pageNum: number): Observable<Event[]> {
    const pageParam = {key: 'pageNum', value: pageNum};
    return this.http.get<Event[]>(constructBackendRequest(Endpoints.HOMEPAGE_EVENTS, pageParam))
      .pipe(map((data: any) => {
        return data.map((eventData: EventJSON) => {
          return new Event(eventData)
        })
      }))
  }

  /**
   * Gets the user's interest status for a specific event
   */
  getInterestStatus(eventId: number, userId: string): Observable<any> {
    const eventIdParam = {key: 'eventId', value: eventId};
    const userIdParam = {key: 'userId', value: userId};

    return this.http.get<any>(
      constructBackendRequest(Endpoints.EVENT_TRACKING, eventIdParam, userIdParam),
      {
        headers: { 'X-Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      }
    );
  }

  /**
   * Toggles the user's interest in an event
   */
  toggleInterest(eventId: number, userId: string, isInterested: boolean): Observable<any> {
    const url = constructBackendRequest(Endpoints.EVENT_TRACKING_SAVE);
    const payload = { eventId, userId, isInterested };

    // Save the user's interest state in localStorage
    localStorage.setItem(`event-${eventId}-interest`, JSON.stringify(isInterested));

    return this.http.post<Event>(url, payload, {
      headers: { 'X-Authorization': `Bearer ${localStorage.getItem('userToken')}` }
    });
  }


}
