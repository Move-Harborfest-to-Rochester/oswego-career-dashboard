import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from 'src/app/util/http-helper';
import { Job, JobJSON } from 'src/domain/Job';
import { constructBackendRequest } from '../../util/http-helper';
import { map, Observable } from 'rxjs';

export type SaveJobRequest = {
  id?: string;
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  coop: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private readonly http: HttpClient) { }

  public saveJob(request: SaveJobRequest): Observable<Job> {
    return this.http.put<JobJSON>(constructBackendRequest(Endpoints.JOBS), request)
      .pipe(map((jobJson) => {
        return new Job(jobJson);
      }));
  }
}
