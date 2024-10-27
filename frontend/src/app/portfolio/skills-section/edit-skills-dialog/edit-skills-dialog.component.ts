import {Component, Input, OnInit} from '@angular/core';
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


export type EditSkillsDefaultValues = {
  skills: any
};
@Component({
  selector: 'app-edit-skills-dialog',
  templateUrl: './edit-skills-dialog.component.html',
  styleUrls: ['./edit-skills-dialog.component.less']
})
export class EditSkillsDialogComponent implements OnInit {
  protected form!: FormGroup;

  @Input() defaultValues?: EditSkillsDefaultValues;

  public constructor(
    private readonly dialogRef: MatDialogRef<EditSkillsDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');
    console.log(this.form);
  }

  createForm() {
    this.form = this.formBuilder.group({
      skills: [this.defaultValues?.skills ?? null],
    });
  }


  saveChanges(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  get skills(): FormArray<FormControl> {
    return this.form?.controls['skills'] as FormArray<FormControl>;
  }

}
