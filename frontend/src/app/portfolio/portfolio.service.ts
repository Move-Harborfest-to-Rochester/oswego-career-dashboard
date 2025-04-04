import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { constructBackendRequest, Endpoints } from '../util/http-helper';
import PersonalInfo, { PersonalInfoJSON } from 'src/domain/PersonalInfo';
import { EditPersonalInfoRequest } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import { EditEducationFormValues } from './education-section/edit-education-dialog/edit-education-dialog.component';
import Education, { EducationJSON } from 'src/domain/Education';
import {StudentDetails, StudentDetailsJSON} from "../../domain/StudentDetails";
import {Skill} from "../../domain/Skill";
import {Interest} from "../../domain/Interest";
import {Club, ClubJSON} from "../../domain/Club";
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
};

export type InterestOperation = {
  id?: string;
  operation: 'Create' | 'Edit' | 'Delete';
  name: string;
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

  // Edit Education (Service Method)
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

  saveSkills(skills: Skill[]): Observable<StudentDetails> {
    const url = constructBackendRequest(Endpoints.EDIT_SKILLS);
    return this.http.put<StudentDetailsJSON>(url, skills)
      .pipe(map(studentDetails => new StudentDetails(studentDetails)));
  }


  saveInterest(interests: Interest[]): Observable<StudentDetails> {
    return this.http.put<StudentDetailsJSON>(constructBackendRequest(Endpoints.EDIT_INTERESTS), interests)
      .pipe(map(studentDetails => new StudentDetails(studentDetails)));
  }


  saveClub(club: Club): Observable<Club> {
    return this.http.put<ClubJSON>(constructBackendRequest(Endpoints.CLUBS), club)
        .pipe(map(clubJSON => new Club(clubJSON)))
  }

  deleteClub(id: string): Observable<void>{
    return this.http.delete<void>(constructBackendRequest(`${Endpoints.CLUBS}/${id}`))
  }

  // Edit Personal Info (Service Method)
  editPersonalInfo(value: EditPersonalInfoRequest): Observable<PersonalInfo> {
    return this.http.patch<PersonalInfoJSON>(constructBackendRequest(Endpoints.EDIT_PERSONAL_INFO), value)
    .pipe(map((json) => new PersonalInfo(json)));
  }

  // Edit Education (With Form Values) (Service Method)
  editEducationFromForm(formValues: EditEducationFormValues): Observable<Education> {
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
