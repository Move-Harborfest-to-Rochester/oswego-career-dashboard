import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { SaveJobDialogComponent } from './save-job-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobService } from '../job/job.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Job } from 'src/domain/Job';
import {MatCheckboxModule} from "@angular/material/checkbox";

describe('SaveJobDialogComponent', () => {
  let component: SaveJobDialogComponent;
  let fixture: ComponentFixture<SaveJobDialogComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<SaveJobDialogComponent>>;
  let jobServiceSpy: jasmine.SpyObj<JobService>;

  beforeEach(() => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    jobServiceSpy = jasmine.createSpyObj('JobService', ['saveJob']);

    TestBed.configureTestingModule({
      declarations: [SaveJobDialogComponent],
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
        MatSnackBarModule,
        MatCheckboxModule,
      ],
      providers: [
        MatDialog,
        { provide: MatDialogRef, useValue: matDialogRef },
        MatDatepickerModule,
        { provide: JobService, useValue: jobServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(SaveJobDialogComponent);
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
    const patchValue = {
      name: 'Test Job',
      location: 'Test Location',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(),
      coop: false,
    };
    component.form.patchValue(patchValue);

    jobServiceSpy.saveJob.and.returnValue(of(new Job({
      ...patchValue,
      id: '1',
      studentDetailsID: '',
    })));
    component.saveJob();

    expect(jobServiceSpy.saveJob).toHaveBeenCalledWith(component.form.value);
  })

  describe('validation', () => {
    it('should have error when name is empty', () => {
      component.form.patchValue({ name: '' });

      expect(component.form.hasError('required', 'name')).toBeTrue();
    });

    it('should have error when location is empty', () => {
      component.form.patchValue({ location: '' });

      expect(component.form.hasError('required', 'location')).toBeTrue();
    });

    it('should have error when startDate is empty', () => {
      component.form.patchValue({ startDate: null });

      expect(component.form.hasError('required', 'startDate')).toBeTrue();
    });

    it('should have error when endDate is before the startDate when startDate is set first', () => {
      component.form.patchValue({ startDate: new Date(2022, 1, 1) });
      component.form.patchValue({ endDate: new Date(2021, 1, 1) });

      expect(component.form.hasError('endDateBeforeStartDate')).toBeTrue();
    });

    it('should have error when endDate is before the startDate when endDate is set first', () => {
      component.form.patchValue({ endDate: new Date(2021, 1, 1) });
      component.form.patchValue({ startDate: new Date(2022, 1, 1) });

      expect(component.form.hasError('endDateBeforeStartDate')).toBeTrue();
    });
  });
});
