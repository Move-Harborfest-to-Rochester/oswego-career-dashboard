import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobDialogComponent } from './create-job-dialog.component';

describe('CreateJobDialogComponent', () => {
  let component: CreateJobDialogComponent;
  let fixture: ComponentFixture<CreateJobDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateJobDialogComponent]
    });
    fixture = TestBed.createComponent(CreateJobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
