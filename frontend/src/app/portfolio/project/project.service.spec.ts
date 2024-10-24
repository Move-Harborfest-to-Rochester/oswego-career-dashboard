import { TestBed } from '@angular/core/testing';

import { ProjectService, SaveProjectRequest } from './project.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Project, ProjectJSON } from 'src/domain/Project';
import { constructBackendRequest, Endpoints } from 'src/app/util/http-helper';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('savePoject', () => {
    const expectedProjectJson: ProjectJSON = {
      id: '0fe320b7-84d4-3456-120v-b3423657aa1k5se',
      name: 'job name',
      description: 'description',
      startDate: new Date(),
      endDate: new Date(),
      studentDetailsID: '28ce0290-3a9e-4259-8e17-873811e01ded'
    };

    const createProjectRequest: SaveProjectRequest = {
      name: expectedProjectJson.name,
      description: expectedProjectJson.description,
      startDate: expectedProjectJson.startDate,
      endDate: expectedProjectJson.endDate ?? null
    };

    it('should save and return project', () => {
      service.saveProject(createProjectRequest).subscribe((project: Project) => {
        expect(project).toEqual(new Project(expectedProjectJson));
      });
      const request = httpMock.expectOne(constructBackendRequest(Endpoints.PROJECTS));
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual(createProjectRequest);
      request.flush(expectedProjectJson);
    });
  })
});
