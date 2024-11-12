import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSitesComponent } from './job-sites.component';

describe('JobSitesComponent', () => {
  let component: JobSitesComponent;
  let fixture: ComponentFixture<JobSitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobSitesComponent]
    });
    fixture = TestBed.createComponent(JobSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
