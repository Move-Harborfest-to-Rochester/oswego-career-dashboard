import { TestBed } from '@angular/core/testing';

import { PortfolioService, DegreeProgramOperation } from './portfolio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditPersonalInfoRequest } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import PersonalInfo, { PersonalInfoJSON } from 'src/domain/PersonalInfo';
import { constructBackendRequest, Endpoints } from '../util/http-helper';
import { EducationJSON } from 'src/domain/Education';
import { YearLevel } from 'src/domain/Milestone';
import { EditEducationFormValues } from './education-section/edit-education-dialog/edit-education-dialog.component';

const createMajor = (): DegreeProgramOperation => ({
  id: '1',
  operation: 'Create',
  name: 'Computer Science',
  isMinor: false,
});

const createMinor = (): DegreeProgramOperation => ({
  id: '2',
  operation: 'Create',
  name: 'Mathematics',
  isMinor: true,
});

describe('PortfolioService', () => {
  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send PATCH request and map response to PersonalInfo object', () => {
    const mockRequest: EditPersonalInfoRequest = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const mockResponse: PersonalInfoJSON = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const expectedPersonalInfo = new PersonalInfo(mockResponse);

    service.editPersonalInfo(mockRequest).subscribe((personalInfo) => {
      expect(personalInfo).toEqual(expectedPersonalInfo);
    });

    const req = httpMock.expectOne(constructBackendRequest(Endpoints.EDIT_PERSONAL_INFO));
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should edit education', () => {
    const formValues: EditEducationFormValues = {
      gpa: '4.0',
      majors: [createMajor()],
      minors: [createMinor()],
      universityId: '1',
      year: YearLevel.Senior
    };

    service.editEducation(formValues).subscribe((user) => {
      expect(user).toBeTruthy();
    });

    const request = httpMock.expectOne(constructBackendRequest(Endpoints.EDIT_EDUCATION));
    expect(request.request.method).toBe('PUT');
    const response: EducationJSON = {
      gpa: Number(formValues.gpa),
      universityId: Number(formValues
        .universityId),
      year: YearLevel.Senior,
      majors: [],
      minors: [],
    };
    request.flush(response);
  });
});

