import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {constructBackendRequest, Endpoints} from "../../util/http-helper";
import {map, Observable} from "rxjs";
import { BasacFaculty, BasacFacultyJSON } from '../../../domain/BasacFaculty';

export interface BasacFacultyPatch {
  faculty: {
    op: string
    id: string
    value: BasacFacultyJSON
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class BasacFacultyService {
  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<BasacFaculty[]> {
    const url = constructBackendRequest(Endpoints.GET_ALL_BASAC_FACULTY);
    return this.http.get<BasacFacultyJSON[]>(url).pipe(
      map(
        basacFaculty => basacFaculty.map(faculty => new BasacFaculty(faculty))
      )
    );
  }

  patch(patchRequest: BasacFacultyPatch): Observable<BasacFaculty[]> {
    const url = constructBackendRequest(Endpoints.PATCH_BASAC_FACULTY);
    return this.http.patch<BasacFacultyJSON[]>(url, patchRequest).pipe(
      map(
        basacFaculty => basacFaculty.map(faculty => new BasacFaculty(faculty))
      )
    );
  }
}
