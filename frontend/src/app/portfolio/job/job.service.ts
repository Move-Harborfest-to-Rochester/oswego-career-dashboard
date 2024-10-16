import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/util/http-helper';
import { Job } from 'src/domain/Job';
import { constructBackendRequest } from '../../util/http-helper';
import { Observable } from 'rxjs';

export type SaveJobRequest = {
  id?: string;
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCoop: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private readonly http: HttpClient) { }

  public saveJob(request: SaveJobRequest): Observable<Job> {
    return this.http.put<Job>(constructBackendRequest(Endpoints.JOBS), request);
  }
}
