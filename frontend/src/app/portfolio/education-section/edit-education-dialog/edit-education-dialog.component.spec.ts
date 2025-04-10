import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {CommonModule} from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {
  DegreeProgramListInputModule
} from './degree-program-list-input/degree-program-list-input.module';
import {EditEducationDialogComponent} from './edit-education-dialog.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {
  DegreeProgramOperation,
  PortfolioService
} from '../../portfolio.service';
import {of, throwError} from 'rxjs';
import Education, {EducationJSON} from 'src/domain/Education';
import {YearLevel} from 'src/domain/Milestone';
import {AuthService} from 'src/app/security/auth.service';
import {ActivatedRoute} from '@angular/router';
import {allMajors} from 'src/app/util/dropdown-constants';
import {
  MultiMajorInputModule
} from './multi-major-input/multi-major-input.module';
import {
  DegreeProgramOperationGroup
} from "./multi-major-input/multi-major-input.component";

describe('EditEducationDialogComponent', () => {
  let component: EditEducationDialogComponent;
  let fixture: ComponentFixture<EditEducationDialogComponent>;
  let majorControl: FormControl<DegreeProgramOperation | null>;

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditEducationDialogComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let portfolioService: jasmine.SpyObj<PortfolioService>;

  const educationJSON: EducationJSON = {
    year: YearLevel.Senior,
    gpa: 3.8,
    majors: [],
    minors: [],
    universityId: 123
  };
  const formValues = {
    universityId: '123',
    year: 'Senior',
    gpa: '3.8',
    majors: [],
    minors: []
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'addPanelClass'
    ]);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    portfolioService = jasmine.createSpyObj('PortfolioService', ['editEducation']);

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
        MultiMajorInputModule,
        DegreeProgramListInputModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MatSnackBar, useValue: snackBarSpy},
        {provide: PortfolioService, useValue: portfolioService},
        {provide: ActivatedRoute, useValue: {paramMap: of({id: '1'})}},
        {provide: AuthService, useValue: {}}
      ]
    });
    fixture = TestBed.createComponent(EditEducationDialogComponent);
    component = fixture.componentInstance;
    component.createForm();
    majorControl = new FormControl<DegreeProgramOperation>({
      operation: 'Create',
      name: allMajors[0],
      isMinor: false,
    }, {
      validators: component.majorNameValidators
    });
    (component.form.get('majors') as FormArray<DegreeProgramOperationGroup>).push(new FormGroup({
      id: new FormControl(''),
      operation: new FormControl(majorControl.value!.operation, component.operationValidators()),
      name: new FormControl(allMajors[0], component.majorNameValidator()),
      isMinor: new FormControl(false),
    }) as DegreeProgramOperationGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate university id', () => {
    const universityIdControl = component.form.get('universityId');

    universityIdControl?.setValue('');
    expect(universityIdControl?.valid).toBeFalse();

    universityIdControl?.setValue('123');
    expect(universityIdControl?.valid).toBeTrue();

    universityIdControl?.setValue('abc');
    expect(universityIdControl?.valid).toBeFalse();

    universityIdControl?.setValue('e');
    expect(universityIdControl?.valid).toBeFalse();
  });

  it('should validate gpa', () => {
    const gpaControl = component.form.get('gpa');

    gpaControl?.setValue('');
    expect(gpaControl?.valid).toBeTrue();

    gpaControl?.setValue('4.0');
    expect(gpaControl?.valid).toBeTrue();

    gpaControl?.setValue('3.2');
    expect(gpaControl?.valid).toBeTrue();

    gpaControl?.setValue('5.0');
    expect(gpaControl?.valid).toBeFalse();

    gpaControl?.setValue('abc');
    expect(gpaControl?.valid).toBeFalse();
  });

  it('marks empty major invalid', () => {
    majorControl.setValue({operation: 'Create', name: '', isMinor: false});
    expect(majorControl.hasError('invalidMajor')).toBeTrue();
  });

  it('still marks non-existent major as valid', () => {
    majorControl.setValue({
      operation: 'Create',
      name: 'Information Science',
      isMinor: false
    });
    expect(majorControl.hasError('invalidMajor')).toBeTrue();
  });

  it('should submit properly', () => {
    portfolioService.editEducation.and.returnValue(of(new Education(educationJSON)));
    component.form.setValue(formValues);

    component.saveChanges();

    expect(portfolioService.editEducation).toHaveBeenCalledWith(formValues);
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Education saved successfully.', 'Close', {
      duration: 5000
    });
  });

  it('should handle submission error', () => {
    portfolioService.editEducation.and.returnValue(throwError(() => new Error('Error')));

    component.form.setValue(formValues);

    component.saveChanges();
    expect(portfolioService.editEducation).toHaveBeenCalledWith(formValues);
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Education failed to save.', 'Close', {
      duration: 5000
    });
  });
});
