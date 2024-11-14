import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, UserJSON } from '../security/domain/user';
import { constructBackendRequest, Endpoints } from '../util/http-helper';

export type DegreeProgramOperation = {
  id?: string;
  operation: 'Create' | 'Edit' | 'Delete';
  name: string;
  isMinor: boolean;
};

export type SkillsOperation = {
    id?: string;
    operation: 'Create' | 'Edit' | 'Delete';
    name: string;
    isLanguage: boolean;
}

export type EditEducationRequest = {
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

  editEducation(request: EditEducationRequest): Observable<User> {
    console.log('editEducation', request);
    return this.http
      .put<UserJSON>(constructBackendRequest(Endpoints.EDIT_EDUCATION), request)
      .pipe(map((user) => new User(user)));
  }

  editSkillsPatch(patch: any[], studentDetailsID: string): Observable<User> {
    const url = constructBackendRequest(Endpoints.EDIT_SKILLS + studentDetailsID);
    return this.http.patch<UserJSON>(url, patch).pipe(map((response) => new User(response)));
  }
}
