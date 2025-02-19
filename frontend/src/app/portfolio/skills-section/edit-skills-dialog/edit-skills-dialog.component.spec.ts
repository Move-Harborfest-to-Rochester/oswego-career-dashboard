import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { EditSkillsDialogComponent, EditSkillsDefaultValues } from './edit-skills-dialog.component';
import { SkillsOperation } from '../../portfolio.service';

describe('EditSkillsDialogComponent', () => {
  let component: EditSkillsDialogComponent;
  let fixture: ComponentFixture<EditSkillsDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditSkillsDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'addPanelClass']);

    await TestBed.configureTestingModule({
      declarations: [EditSkillsDialogComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and add the "edit-dialog" panel class', () => {
    expect(component).toBeTruthy();
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledWith('edit-dialog');
  });

  describe('getDefaultValue', () => {
    it('should return a default SkillsOperation with operation "Create", empty name, and isLanguage set to isLanguageParent value', () => {
      component.isLanguageParent = true;
      const defaultValue = component.getDefaultValue();
      expect(defaultValue).toEqual({
        operation: 'Create',
        name: '',
        isLanguage: true,
      });
      component.isLanguageParent = false;
      const defaultValue2 = component.getDefaultValue();
      expect(defaultValue2).toEqual({
        operation: 'Create',
        name: '',
        isLanguage: false,
      });
    });
  });

  describe('createForm', () => {
    it('should initialize the form with default skills if provided', () => {
      const skills: SkillsOperation[] = [
        { operation: 'Edit', name: 'Skill1', isLanguage: false, id: '1' },
        { operation: 'Edit', name: 'Skill2', isLanguage: false, id: '2' },
      ];
      component.defaultValues = { skills } as EditSkillsDefaultValues;
      component.createForm();
      fixture.detectChanges();

      expect(component.form).toBeDefined();
      expect(component.skills.length).toBe(skills.length);
      skills.forEach((skill, index) => {
        expect(component.skills.at(index).value).toEqual(skill);
      });
    });

    it('should initialize the form with an empty array if defaultValues is not provided', () => {
      component.defaultValues = undefined;
      component.createForm();
      fixture.detectChanges();

      expect(component.form).toBeDefined();
      expect(component.skills.length).toBe(0);
    });
  });

  describe('handleEdits', () => {
    let initialSkills: SkillsOperation[];
    beforeEach(() => {
      initialSkills = [
        { operation: 'Edit', name: 'Skill1', isLanguage: false, id: '1' },
        { operation: 'Edit', name: 'Skill2', isLanguage: false, id: '2' },
      ];
      component.defaultValues = { skills: initialSkills } as EditSkillsDefaultValues;
      component.createForm();
      fixture.detectChanges();
    });

    it('should add a new skill for a "Create" operation if name is not empty', () => {
      const newSkill: SkillsOperation = { operation: 'Create', name: 'New Skill', isLanguage: false };
      const formValue = { skills: [...initialSkills, newSkill] };

      const result = component.handleEdits(formValue);
      // Since initial skills come from defaultValues, the new skill should be appended.
      expect(result.length).toBe(initialSkills.length + 1);
      expect(result[result.length - 1].name).toBe('New Skill');
      // The form array should be updated accordingly.
      expect(component.skills.length).toBe(initialSkills.length + 1);
    });

    it('should update an existing skill for an "Edit" operation if name is not empty', () => {
      const editedSkill: SkillsOperation = { operation: 'Edit', name: 'Skill1 Updated', isLanguage: false, id: '1' };
      const formValue = { skills: [editedSkill, initialSkills[1]] };

      const result = component.handleEdits(formValue);
      // The first skill should be updated, total count remains the same.
      expect(result.length).toBe(initialSkills.length);
      const updatedSkill = result.find(skill => skill.id === '1');
      expect(updatedSkill).toBeDefined();
      expect(updatedSkill?.name).toBe('Skill1 Updated');
      expect(component.skills.length).toBe(initialSkills.length);
    });

    it('should remove a skill for an "Edit" operation if name is empty', () => {
      const editedSkill: SkillsOperation = { operation: 'Edit', name: '   ', isLanguage: false, id: '1' };
      const formValue = { skills: [editedSkill, initialSkills[1]] };

      const result = component.handleEdits(formValue);
      // The first skill should be removed.
      expect(result.length).toBe(initialSkills.length - 1);
      expect(result.find(skill => skill.id === '1')).toBeUndefined();
      expect(component.skills.length).toBe(initialSkills.length - 1);
    });

    it('should remove a skill for a "Delete" operation', () => {
      const deleteSkill: SkillsOperation = { operation: 'Delete', name: '', isLanguage: false, id: '1' };
      const formValue = { skills: [deleteSkill, initialSkills[1]] };

      const result = component.handleEdits(formValue);
      // The first skill should be removed.
      expect(result.length).toBe(initialSkills.length - 1);
      expect(result.find(skill => skill.id === '1')).toBeUndefined();
      expect(component.skills.length).toBe(initialSkills.length - 1);
    });

    it('should not add a new skill for a "Create" operation if the name is empty', () => {
      const newSkill: SkillsOperation = { operation: 'Create', name: '   ', isLanguage: false };
      const formValue = { skills: [...initialSkills, newSkill] };

      const result = component.handleEdits(formValue);
      // Count should remain the same since the new skill name is empty.
      expect(result.length).toBe(initialSkills.length);
      expect(component.skills.length).toBe(initialSkills.length);
    });
  });

  describe('saveChanges', () => {
    beforeEach(() => {
      component.defaultValues = { skills: [] } as EditSkillsDefaultValues;
      component.createForm();
      fixture.detectChanges();
    });

    it('should not close the dialog if the form is invalid', () => {
      // Mark the form as invalid.
      component.form.setErrors({ invalid: true });
      component.saveChanges();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close the dialog with updated skills if the form is valid', () => {
      const initialSkills: SkillsOperation[] = [
        { operation: 'Edit', name: 'Skill1', isLanguage: false, id: '1' }
      ];
      component.defaultValues = { skills: initialSkills } as EditSkillsDefaultValues;
      component.createForm();
      fixture.detectChanges();

      // Simulate an update on the first skill.
      const updatedSkills: SkillsOperation[] = [
        { operation: 'Edit', name: 'Skill1 Updated', isLanguage: false, id: '1' }
      ];
      // Update the form control value.
      component.form.controls['skills'].setValue(updatedSkills);
      component.form.updateValueAndValidity();

      component.saveChanges();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.handleEdits({ skills: updatedSkills }));
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog when closeDialog is called', () => {
      component.closeDialog();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

  // describe('skills getter', () => {
  //   it('should return the skills FormArray from the form', () => {
  //     component.createForm();
  //     fixture.detectChanges();
  //     const skillsArray = component.skills;
  //     expect(skillsArray).toBe(component.form.controls['skills']);
  //     expect(skillsArray instanceof FormArray).toBeTrue();
  //   });
  // });
});
