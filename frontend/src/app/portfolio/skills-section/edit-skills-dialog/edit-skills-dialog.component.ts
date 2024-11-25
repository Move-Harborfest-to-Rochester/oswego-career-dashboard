import {Component, Inject, Input, OnInit} from '@angular/core';
import {
  AbstractControl, type FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Skill} from "../../../../domain/Skill";
import {SkillsOperation} from "../../portfolio.service";

export type EditSkillsDefaultValues = {
  skills: SkillsOperation[]
};
@Component({
  selector: 'app-edit-skills-dialog',
  templateUrl: './edit-skills-dialog.component.html',
  styleUrls: ['./edit-skills-dialog.component.less']
})
export class EditSkillsDialogComponent implements OnInit {
  protected form!: FormGroup;

  @Input() defaultValues?: EditSkillsDefaultValues;
  @Input() isLanguageParent?: boolean;

  public constructor(
    private readonly dialogRef: MatDialogRef<EditSkillsDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');
  }

  createForm() {
    this.form = this.formBuilder.group({
      skills: this.formBuilder.array<FormControl>(
        this.defaultValues?.skills.map((skill) =>
          this.formBuilder.control(skill)
        ) ?? []
      ),
    });
  }
  handleEdits(formValue: { skills: SkillsOperation[] }): Skill[] {
    let updatedSkillsList: Skill[] = this.defaultValues?.skills.map(skill => ({
      id: skill.id ?? '', // Ensure id is defined
      name: skill.name,
      isLanguage: skill.isLanguage,
    })) || [];

    formValue.skills.forEach((skillOperation) => {
      if (skillOperation.operation === "Create") {
        // Add new skill
        updatedSkillsList.push({
          id: skillOperation.id ?? '',  // Ensure id is a string
          name: skillOperation.name,
          isLanguage: skillOperation.isLanguage,
        });
      } else if (skillOperation.operation === "Edit") {
        // Update an existing skill
        const index = updatedSkillsList.findIndex(skill => skill.id === skillOperation.id);
        if (index !== -1) {
          updatedSkillsList[index] = {
            id: updatedSkillsList[index].id, // Keep original id
            name: skillOperation.name,
            isLanguage: skillOperation.isLanguage,
          };
        }
      } else if (skillOperation.operation === "Delete") {
        // Remove skill by id
        updatedSkillsList = updatedSkillsList.filter(skill => skill.id !== skillOperation.id);
      }
    });

    this.updateFormArray(updatedSkillsList);

    return updatedSkillsList;
  }

  updateFormArray(updatedSkillsList: Skill[]): void {
    const formArray = this.skills;
    formArray.clear();  // Clear existing controls
    updatedSkillsList.forEach(skill => {
      formArray.push(this.formBuilder.control(skill));  // Re-add updated list to FormArray
    });
    console.log("Form array length after update:", formArray.length);
  }





  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.handleEdits(this.form.value));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  get skills(): FormArray<FormControl> {
    return this.form?.controls['skills'] as FormArray<FormControl>;
  }

}
