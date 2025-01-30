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

  getDefaultValue(): SkillsOperation {
    return {
      operation: 'Create',
      name: '',
      isLanguage: this.isLanguageParent!,
    }
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
      id: skill.id ?? '',
      name: skill.name,
      isLanguage: skill.isLanguage,
    })) || [];

    formValue.skills.forEach((skillOperation) => {
      const nameIsNotEmpty = !!skillOperation.name && skillOperation.name.trim().length > 0;
      if (skillOperation.operation === 'Create') {
        if (nameIsNotEmpty) {
          updatedSkillsList.push({
            id: skillOperation.id ?? '',
            name: skillOperation.name,
            isLanguage: skillOperation.isLanguage,
          });
        }
      } else if (skillOperation.operation === 'Edit') {
        const index = updatedSkillsList.findIndex(skill => skill.id === skillOperation.id);
        if (index !== -1) {

          if (nameIsNotEmpty) {
            updatedSkillsList[index] = {
              id: updatedSkillsList[index].id,
              name: skillOperation.name,
              isLanguage: skillOperation.isLanguage,
            };
          } else {
            updatedSkillsList.splice(index, 1);
          }
        }

      } else if (skillOperation.operation === 'Delete') {
        updatedSkillsList = updatedSkillsList.filter(skill => skill.id !== skillOperation.id);
      }
    });

    this.updateFormArray(updatedSkillsList);
    return updatedSkillsList;
  }

  updateFormArray(updatedSkillsList: Skill[]): void {
    const formArray = this.skills;
    formArray.clear();
    updatedSkillsList.forEach(skill => {
      formArray.push(this.formBuilder.control(skill));
    });
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
