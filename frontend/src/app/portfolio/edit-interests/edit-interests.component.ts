import {Component, Input, OnInit} from '@angular/core';
import {type FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {
  EditSkillsDefaultValues
} from "../skills-section/edit-skills-dialog/edit-skills-dialog.component";
import {InterestOperation, SkillsOperation} from "../portfolio.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Skill} from "../../../domain/Skill";
import {Interest} from "../../../domain/Interest";

export type EditInterestDefaultValue = {
  interests: InterestOperation[]
};

@Component({
  selector: 'app-edit-interests',
  templateUrl: './edit-interests.component.html',
  styleUrls: ['./edit-interests.component.less']
})
export class EditInterestsComponent implements OnInit {
  protected form!: FormGroup;

  @Input() defaultValues?: EditInterestDefaultValue;

  public constructor(
    private readonly dialogRef: MatDialogRef<EditInterestsComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');
  }

  getDefaultInterest(): InterestOperation {
    return {
      operation: 'Create',
      name: '',
    }
  }


  createForm() {
    this.form = this.formBuilder.group({
      interests: this.formBuilder.array<FormControl>(
        this.defaultValues?.interests.map((interest) =>
          this.formBuilder.control(interest)
        ) ?? []
      ),
    });
  }
  handleEdits(formValue: { interests: InterestOperation[] }): Interest[] {
    // Create a util out of this method ?
    let updatedSkillsList: Interest[] = this.defaultValues?.interests.map(interest => ({
      id: interest.id ?? '',
      name: interest.name ?? '',
    })) || [];

    formValue.interests.forEach((skillOperation) => {
      const interestIsNotEmpty = !!skillOperation.name && skillOperation.name.trim().length > 0;

      if (skillOperation.operation === "Create") {
        if (interestIsNotEmpty){
          updatedSkillsList.push({
            id: skillOperation.id ?? '',
            name: skillOperation.name,
          });
        }
      } else if (skillOperation.operation === "Edit") {
        // Update an existing skill
        const index = updatedSkillsList.findIndex(skill => skill.id === skillOperation.id);
        if (index !== -1) {

          if (interestIsNotEmpty) {
            updatedSkillsList[index] = {
              id: updatedSkillsList[index].id,
              name: skillOperation.name,
            };
          } else {
            updatedSkillsList.splice(index, 1)
          }

        }
      } else if (skillOperation.operation === "Delete") {
        updatedSkillsList = updatedSkillsList.filter(skill => skill.id !== skillOperation.id);
      }
    });
    this.updateFormArray(updatedSkillsList);
    return updatedSkillsList;
  }

  updateFormArray(updatedSkillsList: Interest[]): void {
    const formArray = this.interests;
    formArray.clear();
    updatedSkillsList.forEach(interest => {
      formArray.push(this.formBuilder.control(interest));
    });

  }

  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.handleEdits(this.form.value))
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  get interests(): FormArray<FormControl> {
    return this.form?.controls['interests'] as FormArray<FormControl>;
  }

}
