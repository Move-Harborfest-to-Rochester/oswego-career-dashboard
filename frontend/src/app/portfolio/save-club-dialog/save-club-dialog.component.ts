import {Component, Inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Club} from "../../../domain/Club";
import {validateEndDateBeforeStartDate} from "../../util/validation-utils";

@Component({
  selector: 'app-save-club-dialog',
  templateUrl: './save-club-dialog.component.html',
  styleUrls: ['../save-job-dialog/save-job-dialog.component.less']
})
export class SaveClubDialogComponent {
  title: string = 'Add Club'

  readonly today: Date = new Date();
  form!: FormGroup;
  constructor(
    private readonly dialogRef: MatDialogRef<SaveClubDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly club?: Club
  ) {
  }


  ngOnInit(): void {

    if (this.club) this.title = 'Edit Club'

    this.form = this.fb.group(
      {
        id: [this.club?.id ?? ''],
        name: [this.club?.name ?? '', Validators.required],
        startDate: [this.club?.startDate ?? null, Validators.required],
        endDate: [this.club?.endDate ?? null]
      },{
        validators: this.dateRangeValidator
      }
    )
  }

  dateRangeValidator(formControl: AbstractControl): ValidationErrors | null {
    const startDate = formControl.get('startDate')?.value;
    const endDate = formControl.get('endDate')?.value;

    return validateEndDateBeforeStartDate(startDate, endDate);
  }

  hasError(error: string): boolean {
    return this.form.hasError(error) && (this.form.touched || this.form.dirty)
  }
  get clubControl(): FormControl<string> {
    return this.form.get('name') as FormControl<string>;
  }

  saveClub() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }



  close() {
    this.dialogRef.close();
  }
}
