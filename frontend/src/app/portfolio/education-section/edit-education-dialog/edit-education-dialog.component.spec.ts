import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DegreeProgramListInputModule } from './degree-program-list-input/degree-program-list-input.module';
import { EditEducationDialogComponent } from './edit-education-dialog.component';

describe('EditEducationDialogComponent', () => {
  let component: EditEducationDialogComponent;
  let fixture: ComponentFixture<EditEducationDialogComponent>;

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditEducationDialogComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'addPanelClass'
    ]);

    TestBed.configureTestingModule({
      declarations: [EditEducationDialogComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        DegreeProgramListInputModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }]
    });
    fixture = TestBed.createComponent(EditEducationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
