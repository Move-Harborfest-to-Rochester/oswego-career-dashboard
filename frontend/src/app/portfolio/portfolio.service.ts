import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import PersonalInfo, { PersonalInfoJSON } from 'src/domain/PersonalInfo';
import { EditPersonalInfoRequest } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import * as http from 'http';
import { HttpClient } from '@angular/common/http';
import { constructBackendRequest, Endpoints } from '../util/http-helper';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private readonly http: HttpClient) { }

  public editPersonalInfo(value: EditPersonalInfoRequest): Observable<PersonalInfo> {
    return this.http.patch<PersonalInfoJSON>(constructBackendRequest(Endpoints.EDIT_PERSONAL_INFO), value)
      .pipe(map((json) => new PersonalInfo(json)));
  }
}
