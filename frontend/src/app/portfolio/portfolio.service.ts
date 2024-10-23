import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, UserJSON } from '../security/domain/user';
import { constructBackendRequest, Endpoints } from '../util/http-helper';
import { EditEducationFormValues } from './education-section/edit-education-dialog/edit-education-dialog.component';

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

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private readonly http: HttpClient) {}

  editEducation(formValues: EditEducationFormValues): Observable<User> {
    const request: EditEducationRequest = {
      gpa: Number(formValues.gpa),
      universityId: Number(formValues.universityId),
      year: formValues.year,
      degreeProgramOperations: [...formValues.majors, ...formValues.minors],
    };
    return this.http
      .put<UserJSON>(constructBackendRequest(Endpoints.EDIT_EDUCATION), request)
      .pipe(map((user) => new User(user)));
  }
}