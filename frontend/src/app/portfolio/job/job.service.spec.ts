import { TestBed } from '@angular/core/testing';

import { JobService, SaveJobRequest } from './job.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Job } from 'src/domain/Job';
import { constructBackendRequest, Endpoints } from 'src/app/util/http-helper';

describe('JobService', () => {
  let service: JobService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [JobService],
    });
    service = TestBed.inject(JobService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveJob', () => {
    const expectedJob: Job = {
      id: '0fe404b7-64d8-4275-901e-a37249cc1d2c',
      name: 'job name',
      location: 'location',
      description: 'description',
      startDate: new Date(),
      studentDetailsID: '28ce0290-3a9e-4259-8e17-873811e01ded',
      isCoop: false
    }

    const createJobRequest: SaveJobRequest = {
      name: expectedJob.name,
      location: expectedJob.location,
      description: expectedJob.description,
      startDate: expectedJob.startDate,
      endDate: expectedJob.endDate,
      isCoop: expectedJob.isCoop
    };

    it('should save and return job', () => {
      service.saveJob(createJobRequest).subscribe((job: Job) => {
        expect(job).toEqual(expectedJob);
      });
      const request = httpMock.expectOne(constructBackendRequest(Endpoints.JOBS));
      expect(request.request.method).toEqual('PUT');
      request.flush(expectedJob);
    });
  })
});
