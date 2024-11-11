import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { AddProjectModalComponent } from './add-project-modal.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AddProjectModalComponent', () => {
  let component: AddProjectModalComponent;
  let fixture: ComponentFixture<AddProjectModalComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<AddProjectModalComponent>>;

  beforeEach(() => {
    matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [AddProjectModalComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatNativeDateModule,
        FormsModule
      ],
      providers: [
        MatDialog,
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        MatDatepickerModule,
      ]
    }).compileComponents();;
    fixture = TestBed.createComponent(AddProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    component.onClose();
    expect(matDialogRef.close).toHaveBeenCalled();
  })

  it('should create project on submit', () => {
    component.projectForm.patchValue({
      name: 'Test Project',
      description: 'Test Description',
      startDate: new Date(),
      endDate: new Date(),
    });
    component.onSubmit();
    expect(matDialogRef.close).toHaveBeenCalledWith(component.projectForm.value);
  })

  describe('validation', () => {
    it('should have error when name is empty', () => {
      component.projectForm.patchValue({ name: '' });

      expect(component.projectForm.hasError('required', 'name')).toBeTrue();
    });

    it('should have error when description is empty', () => {
      component.projectForm.patchValue({ description: '' });

      expect(component.projectForm.hasError('required', 'description')).toBeTrue();
    });

    it('should have error when startDate is empty', () => {
      component.projectForm.patchValue({ startDate: null });

      expect(component.projectForm.hasError('required', 'startDate')).toBeTrue();
    });

    it('should have error when endDate is before the startDate when startDate is set first', () => {
      component.projectForm.patchValue({ startDate: new Date(2022, 1, 1) });
      component.projectForm.patchValue({ endDate: new Date(2021, 1, 1) });

      expect(component.projectForm.hasError('endDateBeforeStartDate')).toBeTrue();
    });

    it('should have error when endDate is before the startDate when endDate is set first', () => {
      component.projectForm.patchValue({ endDate: new Date(2021, 1, 1) });
      component.projectForm.patchValue({ startDate: new Date(2022, 1, 1) });

      expect(component.projectForm.hasError('endDateBeforeStartDate')).toBeTrue();
    });
  });
});
