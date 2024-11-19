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

  createForm() {
    this.form = this.formBuilder.group({
      skills: this.formBuilder.array<FormControl>(
        this.defaultValues?.interests.map((interest) =>
          this.formBuilder.control(interest)
        ) ?? []
      ),
    });
  }
  // handleEdits(formValue: { skills: SkillsOperation[] }): Skill[] {
  //   let updatedSkillsList: Skill[] = this.defaultValues?.skills.map(skill => ({
  //     id: skill.id ?? '', // Ensure id is defined
  //     name: skill.name,
  //     isLanguage: skill.isLanguage,
  //   })) || [];
  //
  //   formValue.skills.forEach((skillOperation) => {
  //     if (skillOperation.operation === "Create") {
  //       // Add new skill
  //       updatedSkillsList.push({
  //         id: skillOperation.id ?? '',  // Ensure id is a string
  //         name: skillOperation.name,
  //         isLanguage: skillOperation.isLanguage,
  //       });
  //     } else if (skillOperation.operation === "Edit") {
  //       // Update an existing skill
  //       const index = updatedSkillsList.findIndex(skill => skill.id === skillOperation.id);
  //       if (index !== -1) {
  //         updatedSkillsList[index] = {
  //           id: updatedSkillsList[index].id, // Keep original id
  //           name: skillOperation.name,
  //           isLanguage: skillOperation.isLanguage,
  //         };
  //       }
  //     } else if (skillOperation.operation === "Delete") {
  //       // Remove skill by id
  //       updatedSkillsList = updatedSkillsList.filter(skill => skill.id !== skillOperation.id);
  //     }
  //   });
  //
  //   console.log("Updated skills list after operations:", updatedSkillsList);
  //
  //   // Patch the form array to match the new list of skills
  //   this.updateFormArray(updatedSkillsList);
  //
  //   return updatedSkillsList;
  // }

  // updateFormArray(updatedSkillsList: Interest[]): void {
  //   const formArray = this.interests;
  //   formArray.clear();  // Clear existing controls
  //   updatedSkillsList.forEach(skill => {
  //     formArray.push(this.formBuilder.control(skill));  // Re-add updated list to FormArray
  //   });
  //   console.log("Form array length after update:", formArray.length);
  // }

  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }

    // this.dialogRef.close(this.handleEdits(this.form.value));
    this.dialogRef.close(this.form.value)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  get interests(): FormArray<FormControl> {
    return this.form?.controls['interests'] as FormArray<FormControl>;
  }

}
