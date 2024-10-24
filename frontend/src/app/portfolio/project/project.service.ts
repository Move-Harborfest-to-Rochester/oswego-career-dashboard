import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/util/http-helper';
import { Project, ProjectJSON } from 'src/domain/Project';
import { constructBackendRequest } from '../../util/http-helper';
import { map, Observable } from 'rxjs';

export type SaveProjectRequest = {
  id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private readonly http: HttpClient) { }

  public saveProject(request: SaveProjectRequest): Observable<Project> {
    return this.http.put<ProjectJSON>(constructBackendRequest(Endpoints.PROJECTS), request)
      .pipe(map((projectJson) => {
        console.log('project testing', projectJson);
        return new Project(projectJson);
      }));
  }
}
