import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import PersonalInfo, { PersonalInfoJSON } from 'src/domain/PersonalInfo';
import { EditPersonalInfoRequest } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import * as http from 'http';
import { HttpClient } from '@angular/common/http';
import { constructBackendRequest, Endpoints } from '../util/http-helper';
import { EditEducationFormValues } from './education-section/edit-education-dialog/edit-education-dialog.component';
import Education, { EducationJSON } from 'src/domain/Education';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private readonly http: HttpClient) { }

  public editPersonalInfo(value: EditPersonalInfoRequest): Observable<PersonalInfo> {
    return this.http.patch<PersonalInfoJSON>(constructBackendRequest(Endpoints.EDIT_PERSONAL_INFO), value)
      .pipe(map((json) => new PersonalInfo(json)));
  }


  editEducation(formValues: EditEducationFormValues): Observable<Education> {
    const request: EditEducationRequest = {
      gpa: Number(formValues.gpa),
      universityId: Number(formValues.universityId),
      year: formValues.year,
      degreeProgramOperations: [...formValues.majors, ...formValues.minors],
    };
    return this.http
      .put<EducationJSON>(constructBackendRequest(Endpoints.EDIT_EDUCATION), request)
      .pipe(map((json) => new Education(json)));
  }
}

export type DegreeProgramOperation = {
  id?: string;
  operation: 'Create' | 'Edit' | 'Delete';
  name: string;
  isMinor: boolean;
};

type EditEducationRequest = {
  universityId: number;
  year: string;
  gpa: number;
  degreeProgramOperations: DegreeProgramOperation[];
};
