import { TestBed } from '@angular/core/testing';

import { PortfolioService } from './portfolio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditPersonalInfoRequest } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import PersonalInfo, { PersonalInfoJSON } from 'src/domain/PersonalInfo';
import { constructBackendRequest, Endpoints } from '../util/http-helper';

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
});
