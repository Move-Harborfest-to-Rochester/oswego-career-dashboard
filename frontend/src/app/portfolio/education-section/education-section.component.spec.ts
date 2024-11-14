import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';
import { studentDetails, userJSON } from 'src/app/security/auth.service.spec';
import { User } from 'src/app/security/domain/user';
import { EditEducationDialogModule } from './edit-education-dialog/edit-education-dialog.module';
import { EducationSectionComponent } from './education-section.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EditEducationDialogComponent, EditEducationFormValues } from './edit-education-dialog/edit-education-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EducationSectionComponent', () => {
  let component: EducationSectionComponent;
  let fixture: ComponentFixture<EducationSectionComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditEducationDialogComponent>>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      user$: of(new User(userJSON))
    });
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['addPanelClass'], {
      componentInstance: {
        defaultValues: {},
      }
    });
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      declarations: [EducationSectionComponent],
      imports: [
        CommonModule,
        EditEducationDialogModule,
        MatIconModule,
        MatButtonModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ]
    });
    fixture = TestBed.createComponent(EducationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open edit dialog', () => {
    component.openEditDialog();

    expect(dialogSpy.open).toHaveBeenCalledWith(EditEducationDialogComponent);
    expect(dialogRefSpy.componentInstance.defaultValues).toEqual({
      universityId: studentDetails.universityId,
      year: studentDetails.yearLevel,
      gpa: `${studentDetails.gpa}`,
      majors: studentDetails.degreePrograms
        .filter((program) => !program.minor)
        .map((program) => ({
          id: program.id,
          name: program.name,
          operation: 'Edit',
          isMinor: false,
        })),
      minors: studentDetails.degreePrograms
        .filter((program) => program.minor)
        .map((program) => ({
          id: program.id,
          name: program.name,
          operation: 'Edit',
          isMinor: true,
        })),
    })
  });

  it('should get majors from user', () => {
    const majors = component.getMajorsFromUser();

    expect(majors).toEqual(studentDetails.degreePrograms
      .filter((program) => !program.minor)
      .map((program) => ({
        id: program.id,
        operation: 'Edit',
        name: program.name,
        isMinor: false,
      })));
  });

  it('should get minors from user', () => {
    const minors = component.getMinorsFromUser();

    expect(minors).toEqual(studentDetails.degreePrograms
      .filter((program) => program.minor)
      .map((program) => ({
        id: program.id,
        operation: 'Edit',
        name: program.name,
        isMinor: true,
      })));
  });

  it('should get major names from user', () => {
    const majorNames = component.majors();

    expect(majorNames).toEqual(studentDetails.degreePrograms
      .filter((program) => !program.minor)
      .map((program) => program.name));
  });

  it('should get minor names from user', () => {
    const minorNames = component.minors();

    expect(minorNames).toEqual(studentDetails.degreePrograms
      .filter((program) => program.minor)
      .map((program) => program.name));
  });
});
