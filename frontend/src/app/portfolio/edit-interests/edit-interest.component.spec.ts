import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditInterestsComponent, EditInterestDefaultValue } from './edit-interests.component';
import { ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {InterestOperation} from "../portfolio.service";

describe('EditInterestsComponent', () => {
  let component: EditInterestsComponent;
  let fixture: ComponentFixture<EditInterestsComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditInterestsComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'addPanelClass']);

    await TestBed.configureTestingModule({
      declarations: [EditInterestsComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and add the "edit-dialog" panel class', () => {
    expect(component).toBeTruthy();
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledWith('edit-dialog');
  });

  describe('getDefaultInterest', () => {
    it('should return a default InterestOperation with operation "Create" and empty name', () => {
      const defaultInterest = component.getDefaultInterest();
      expect(defaultInterest).toEqual({
        operation: 'Create',
        name: '',
      });
    });
  });

  describe('createForm', () => {
    it('should initialize the form with default interests if provided', () => {
      const interests = [
        { operation: 'Edit', name: 'Interest1', id: '1' },
        { operation: 'Edit', name: 'Interest2', id: '2' },
      ];
      component.defaultValues = { interests } as EditInterestDefaultValue;
      component.createForm();
      fixture.detectChanges();

      expect(component.form).toBeDefined();
      expect(component.interests.length).toBe(interests.length);
      interests.forEach((interest, index) => {
        expect(component.interests.at(index).value).toEqual(interest);
      });
    });

    it('should initialize the form with an empty array if defaultValues is not provided', () => {
      component.defaultValues = undefined;
      component.createForm();
      fixture.detectChanges();

      expect(component.form).toBeDefined();
      expect(component.interests.length).toBe(0);
    });
  });

  describe('handleEdits', () => {
    let initialInterests: any[];
    beforeEach(() => {
      initialInterests = [
        { operation: 'Edit', name: 'Interest1', id: '1' },
        { operation: 'Edit', name: 'Interest2', id: '2' },
      ];
      component.defaultValues = { interests: initialInterests } as EditInterestDefaultValue;
      component.createForm();
      fixture.detectChanges();
    });

    it('should add a new interest for a "Create" operation if name is not empty', () => {
      const newInterest = { operation: 'Create', name: 'New Interest', id: undefined };
      const formValue = { interests: [...initialInterests, newInterest] };

      const result = component.handleEdits(formValue);
      // Since initial interests come from defaultValues, the new interest should be appended.
      expect(result.length).toBe(initialInterests.length + 1);
      expect(result[result.length - 1].name).toBe('New Interest');
      expect(component.interests.length).toBe(initialInterests.length + 1);
    });

    it('should update an existing interest for an "Edit" operation if name is not empty', () => {
      const editedInterest = { operation: 'Edit', name: 'Interest1 Updated', id: '1' };
      const formValue = { interests: [editedInterest, initialInterests[1]] };

      const result = component.handleEdits(formValue);
      // The first interest should be updated, total count remains the same.
      expect(result.length).toBe(initialInterests.length);
      const updatedInterest = result.find(interest => interest.id === '1');
      expect(updatedInterest).toBeDefined();
      expect(updatedInterest?.name).toBe('Interest1 Updated');
      expect(component.interests.length).toBe(initialInterests.length);
    });

    it('should remove an interest for an "Edit" operation if name is empty', () => {
      const editedInterest = { operation: 'Edit', name: '   ', id: '1' };
      const formValue = { interests: [editedInterest, initialInterests[1]] };

      const result = component.handleEdits(formValue);
      // The first interest should be removed.
      expect(result.length).toBe(initialInterests.length - 1);
      expect(result.find(interest => interest.id === '1')).toBeUndefined();
      expect(component.interests.length).toBe(initialInterests.length - 1);
    });

    it('should remove an interest for a "Delete" operation', () => {
      const deleteInterest = { operation: 'Delete', name: '', id: '1' };
      const formValue = { interests: [deleteInterest, initialInterests[1]] };

      const result = component.handleEdits(formValue);
      // The first interest should be removed.
      expect(result.length).toBe(initialInterests.length - 1);
      expect(result.find(interest => interest.id === '1')).toBeUndefined();
      expect(component.interests.length).toBe(initialInterests.length - 1);
    });

    it('should not add a new interest for a "Create" operation if the name is empty', () => {
      const newInterest = { operation: 'Create', name: '   ', id: undefined };
      const formValue = { interests: [...initialInterests, newInterest] };

      const result = component.handleEdits(formValue);
      // Count should remain the same since the new interest name is empty.
      expect(result.length).toBe(initialInterests.length);
      expect(component.interests.length).toBe(initialInterests.length);
    });
  });

  describe('updateFormArray', () => {
    it('should update the interests FormArray with the provided list', () => {
      const updatedList = [
        { id: '1', name: 'Updated Interest1' },
        { id: '3', name: 'Updated Interest3' }
      ];
      component.createForm();
      component.updateFormArray(updatedList);
      fixture.detectChanges();

      expect(component.interests.length).toBe(updatedList.length);
      updatedList.forEach((interest, index) => {
        expect(component.interests.at(index).value).toEqual(interest);
      });
    });
  });

  describe('saveChanges', () => {
    beforeEach(() => {
      component.defaultValues = { interests: [] } as EditInterestDefaultValue;
      component.createForm();
      fixture.detectChanges();
    });

    it('should not close the dialog if the form is invalid', () => {
      // Mark the form as invalid.
      component.form.setErrors({ invalid: true });
      component.saveChanges();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close the dialog with updated interests if the form is valid', () => {
      const initialInterests = [
        { operation: 'Edit', name: 'Interest1', id: '1' }
      ];
      component.defaultValues = { interests: initialInterests } as EditInterestDefaultValue;
      component.createForm();
      fixture.detectChanges();

      // Simulate an update on the interest.
      const updatedInterests: InterestOperation[] = [
        { operation: "Edit", name: "Interest1 Updated", id: "1" }
      ];
      component.form.controls['interests'].setValue(updatedInterests);
      component.form.updateValueAndValidity();

      component.saveChanges();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.handleEdits({ interests: updatedInterests }));
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog when closeDialog is called', () => {
      component.closeDialog();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

  describe('interests getter', () => {
    it('should return the interests FormArray', () => {
      component.createForm();
      fixture.detectChanges();
      expect(component.interests instanceof FormArray).toBeTrue();
    });
  });
});
