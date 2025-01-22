import { TestBed } from '@angular/core/testing';

import { BasacFacultyService } from './basac-faculty.service';

describe('SupportFacultyService', () => {
  let service: BasacFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasacFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
