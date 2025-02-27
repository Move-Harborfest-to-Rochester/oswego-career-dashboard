import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { SaveClubDialogComponent } from './save-club-dialog.component';
import * as validationUtils from '../../util/validation-utils';

describe('SaveClubDialogComponent', () => {
  let component: SaveClubDialogComponent;
  let fixture: ComponentFixture<SaveClubDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SaveClubDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [SaveClubDialogComponent],
      imports: [
        BrowserAnimationsModule, // Required for Angular Material components
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,     // Provides the DateAdapter for the datepicker
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  describe('Component Initialization without club data', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // Triggers ngOnInit()
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set title to "Add Club"', () => {
      expect(component.title).toBe('Add Club');
    });

    it('should initialize the form with default values', () => {
      const formValue = component.form.value;
      expect(formValue.id).toBe('');
      expect(formValue.name).toBe('');
      expect(formValue.startDate).toBeNull();
      expect(formValue.endDate).toBeNull();
    });
  });

  describe('Component Initialization with club data', () => {
    const clubData = {
      id: 'club-1',
      name: 'Club One',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31')
    };

    beforeEach(() => {
      // Override MAT_DIALOG_DATA provider with clubData
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: clubData });
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); // Triggers ngOnInit()
    });

    it('should set title to "Edit Club"', () => {
      expect(component.title).toBe('Edit Club');
    });

    it('should initialize the form with the provided club data', () => {
      const formValue = component.form.value;
      expect(formValue.id).toBe(clubData.id);
      expect(formValue.name).toBe(clubData.name);
      expect(formValue.startDate).toEqual(clubData.startDate);
      expect(formValue.endDate).toEqual(clubData.endDate);
    });
  });

  describe('dateRangeValidator', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    // Helper to create a fake control group with a get() method.
    function createFakeGroup(start: Date, end: Date): AbstractControl {
      return {
        get: (controlName: string) => {
          if (controlName === 'startDate') {
            return { value: start };
          }
          if (controlName === 'endDate') {
            return { value: end };
          }
          return null;
        }
      } as AbstractControl;
    }

    it('should return an error when dates are invalid', () => {
      // When the end date is before the start date, assume the utility returns { endDateBeforeStartDate: true }
      const start = new Date('2025-12-31');
      const end = new Date('2025-01-01');
      const fakeGroup = createFakeGroup(start, end);

      const result = component.dateRangeValidator(fakeGroup);
      expect(result).toEqual({ endDateBeforeStartDate: true });
    });

    it('should return null when dates are valid', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      const fakeGroup = createFakeGroup(start, end);

      const result = component.dateRangeValidator(fakeGroup);
      expect(result).toBeNull();
    });
  });

  describe('hasError', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should return false if the form has no error', () => {
      component.form.setErrors(null);
      component.form.markAsUntouched();
      expect(component.hasError('required')).toBeFalse();
    });

    it('should return false if the form has an error but is not touched or dirty', () => {
      component.form.setErrors({ required: true });
      // Neither touched nor dirty.
      expect(component.hasError('required')).toBeFalse();
    });

    it('should return true if the form has an error and is marked as touched', () => {
      component.form.setErrors({ required: true });
      component.form.markAsTouched();
      expect(component.hasError('required')).toBeTrue();
    });

    it('should return true if the form has an error and is marked as dirty', () => {
      component.form.setErrors({ required: true });
      component.form.markAsDirty();
      expect(component.hasError('required')).toBeTrue();
    });
  });

  describe('saveClub', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not close the dialog if the form is invalid', () => {
      // Leave required "name" field empty to keep the form invalid.
      component.form.controls['name'].setValue('');
      component.saveClub();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });
    //
    // it('should close the dialog with the form value if the form is valid', () => {
    //   const clubValue = {
    //     id: 'test-id',
    //     name: 'Test Club',
    //     startDate: new Date('2025-01-01'),
    //     endDate: new Date('2025-12-31')
    //   };
    //
    //   // Populate the form with valid data.
    //   component.form.controls['id'].setValue(clubValue.id);
    //   component.form.controls['name'].setValue(clubValue.name);
    //   component.form.controls['startDate'].setValue(clubValue.startDate);
    //   component.form.controls['endDate'].setValue(clubValue.endDate);
    //   component.form.updateValueAndValidity();
    //
    //   component.saveClub();
    //   expect(dialogRefSpy.close).toHaveBeenCalledWith(component.form.value);
    // });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SaveClubDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should close the dialog when close is called', () => {
      component.close();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
