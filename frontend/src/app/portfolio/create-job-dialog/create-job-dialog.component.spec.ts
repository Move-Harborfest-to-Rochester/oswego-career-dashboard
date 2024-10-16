import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { CreateJobDialogComponent } from './create-job-dialog.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateJobDialogComponent', () => {
  let component: CreateJobDialogComponent;
  let fixture: ComponentFixture<CreateJobDialogComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<CreateJobDialogComponent>>;

  beforeEach(() => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [CreateJobDialogComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        MatDialog,
        { provide: MatDialogRef, useValue: matDialogRef },
        MatDatepickerModule,
      ]
    });
    fixture = TestBed.createComponent(CreateJobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    component.close();
    expect(matDialogRef.close).toHaveBeenCalled();
  })

  it('should create job on submit', () => {
    component.form.patchValue({
      name: 'Test Job',
      location: 'Test Location',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(),
      isCoop: false,
    });
    component.createJob();
    expect(matDialogRef.close).toHaveBeenCalledWith(component.form.value);
  })
});
