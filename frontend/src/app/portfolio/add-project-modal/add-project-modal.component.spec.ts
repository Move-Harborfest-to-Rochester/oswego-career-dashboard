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
});
