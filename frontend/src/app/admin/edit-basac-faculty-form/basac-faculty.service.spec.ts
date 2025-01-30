import {TestBed} from '@angular/core/testing';

import {BasacFacultyService} from './basac-faculty.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('BasacFacultyService', () => {
  let service: BasacFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BasacFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
