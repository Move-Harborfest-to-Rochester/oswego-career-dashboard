import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditBasacFacultyFormComponent } from './edit-basac-faculty-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import {BasacFacultyPatch, BasacFacultyService} from './basac-faculty.service';
import { BasacFaculty } from '../../../domain/BasacFaculty';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

// Dummy data for testing.
const dummyFacultyArray = [
  { id: '1', name: 'Faculty One', title: 'Professor', email: 'one@example.com' },
  { id: '2', name: 'Faculty Two', title: 'Associate Professor', email: 'two@example.com' },
] as BasacFaculty[];


// A fake service that mimics the BasacFacultyService.
class FakeBasacFacultyService {
  getAll() {
    return of(dummyFacultyArray);
  }
  patch(formValues: any) {
    // For simplicity, just return the dummy data.
    return of(dummyFacultyArray);
  }
}

describe('EditBasacFacultyFormComponent', () => {
  let component: EditBasacFacultyFormComponent;
  let fixture: ComponentFixture<EditBasacFacultyFormComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let service: BasacFacultyService;

  beforeEach(async () => {
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EditBasacFacultyFormComponent],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: BasacFacultyService, useClass: FakeBasacFacultyService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBasacFacultyFormComponent);
    component = fixture.componentInstance;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    service = TestBed.inject(BasacFacultyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & updateFaculty', () => {
    it('should update the form with faculty data on ngOnInit', fakeAsync(() => {
      // ngOnInit calls service.getAll() which in FakeBasacFacultyService returns dummyFacultyArray.
      component.ngOnInit();
      tick();
      fixture.detectChanges();

      const ops = component.facultyOperations;
      expect(ops.length).toBe(dummyFacultyArray.length);

      // Check one of the form groups.
      const firstGroup = ops.at(0) as FormGroup;
      expect(firstGroup.get('op')?.value).toBe('replace');
      expect(firstGroup.get('id')?.value).toBe('1');
      const valueGroup = firstGroup.get('value') as FormGroup;
      expect(valueGroup.get('name')?.value).toBe('Faculty One');
      expect(valueGroup.get('title')?.value).toBe('Professor');
      expect(valueGroup.get('email')?.value).toBe('one@example.com');
    }));
  });

  describe('facultyControls', () => {
    it('should return the controls from the operations FormArray', () => {
      // Update the form with dummy data.
      component.updateFaculty(dummyFacultyArray);
      fixture.detectChanges();
      const controls = component.facultyControls();
      expect(controls.length).toBe(dummyFacultyArray.length);
    });
  });

  describe('submit', () => {
    it('should call service.patch, update the form and show a snackBar message', fakeAsync(() => {
      // Spy on updateFaculty to verify it's called.
      spyOn(component, 'updateFaculty').and.callThrough();

      // Construct a valid BasacFacultyPatch object that includes the "faculty" property.
      const patchValue = {
        faculty: {
          operations: [
            { op: 'replace', id: '1', value: { name: 'Updated One', title: 'Prof', email: 'one@upd.com' } }
          ]
        }
      } as unknown as BasacFacultyPatch;

      // Call submit with the patch value.
      component.submit(patchValue);
      tick();
      fixture.detectChanges();

      // Expect updateFaculty to have been called with dummyFacultyArray (as returned by fake service).
      expect(component.updateFaculty).toHaveBeenCalledWith(dummyFacultyArray);
      expect(snackBarSpy.open).toHaveBeenCalledWith('BASAC Office Faculty updated.', 'Close', { duration: 5000 });
    }));
  });


  describe('deleteFacultyAtIndex', () => {
    beforeEach(() => {
      // Initialize form with two groups.
      component.updateFaculty(dummyFacultyArray);
      fixture.detectChanges();
    });

    it('should remove the control from FormArray if op is "add"', () => {
      // Add a new faculty control manually with op 'add'.
      component.facultyOperations.push(component.formBuilder.group({
        op: component.formBuilder.control('add'),
        value: component.formBuilder.group({
          name: component.formBuilder.control('New Faculty'),
          title: component.formBuilder.control(''),
          email: component.formBuilder.control('')
        })
      }));
      fixture.detectChanges();

      const initialLength = component.facultyOperations.length;
      const controlToDelete = component.facultyOperations.at(initialLength - 1);
      component.deleteFacultyAtIndex(controlToDelete, initialLength - 1);
      fixture.detectChanges();

      // Since op was 'add', the control should be removed.
      expect(component.facultyOperations.length).toBe(initialLength - 1);
    });

    it('should set op to "remove" if op is not "add"', () => {
      // For an existing faculty control, op should be 'replace' by default.
      const control = component.facultyOperations.at(0);
      component.deleteFacultyAtIndex(control, 0);
      fixture.detectChanges();

      expect(control.get('op')?.value).toBe('remove');
    });
  });

  describe('addNewFaculty', () => {
    it('should add a new faculty control with op "add" and empty value group', () => {
      const initialLength = component.facultyOperations.length;
      component.addNewFaculty();
      fixture.detectChanges();

      expect(component.facultyOperations.length).toBe(initialLength + 1);
      const newControl = component.facultyOperations.at(component.facultyOperations.length - 1) as FormGroup;
      expect(newControl.get('op')?.value).toBe('add');
      const valueGroup = newControl.get('value') as FormGroup;
      expect(valueGroup.get('name')?.value).toBe('');
      expect(valueGroup.get('title')?.value).toBe('');
      expect(valueGroup.get('email')?.value).toBe('');
    });
  });

  describe('isDeleted', () => {
    it('should return true if op is "remove", otherwise false', () => {
      component.updateFaculty(dummyFacultyArray);
      fixture.detectChanges();

      const control = component.facultyOperations.at(0);
      // Initially, op is "replace" (from updateFaculty).
      expect(component.isDeleted(control)).toBeFalse();
      // Change op to "remove"
      control.get('op')?.setValue('remove');
      fixture.detectChanges();
      expect(component.isDeleted(control)).toBeTrue();
    });
  });

  describe('getValueFromControl', () => {
    it('should return the value FormGroup from a faculty control', () => {
      component.updateFaculty(dummyFacultyArray);
      fixture.detectChanges();

      const control = component.facultyOperations.at(0);
      const valueGroup = component.getValueFromControl(control);
      expect(valueGroup instanceof FormGroup).toBeTrue();
      // Verify that the name, title, and email match dummy data.
      expect(valueGroup.get('name')?.value).toBe('Faculty One');
      expect(valueGroup.get('title')?.value).toBe('Professor');
      expect(valueGroup.get('email')?.value).toBe('one@example.com');
    });
  });
});
