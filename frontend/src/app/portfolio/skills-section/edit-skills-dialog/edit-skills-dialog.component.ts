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
    let skills: Skill[] = [];

    formValue.skills.forEach((skillOperation) => {
      if (skillOperation.operation === "Create") {
        // Handle new skills to be added
        skills.push({
          id: skillOperation.id ?? '',  // Create a new ID if necessary
          name: skillOperation.name,
          isLanguage: skillOperation.isLanguage
        });
      } else if (skillOperation.operation === "Edit") {
        // Find the existing skill and update its properties
        const skillIndex = this.defaultValues?.skills.findIndex(
          (existingSkill) => existingSkill.id === skillOperation.id
        );
        if (skillIndex !== undefined && skillIndex !== -1) {
          const updatedSkill = {
            id: this.defaultValues!.skills[skillIndex].id || '',
            name: skillOperation.name,
            isLanguage: skillOperation.isLanguage,
          };
          skills.push(updatedSkill);
        }
      } else if (skillOperation.operation === "Delete") {
        // Filter out skills that match the 'Delete' operation
        skills = skills.filter(skill => skill.id !== skillOperation.id);
      }
    });

    return skills;
  }


  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.handleEdits(this.form.value)); // Return new student skills here ?
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  get skills(): FormArray<FormControl> {
    return this.form?.controls['skills'] as FormArray<FormControl>;
  }

}
