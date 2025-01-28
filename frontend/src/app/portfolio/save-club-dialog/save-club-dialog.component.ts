import {Component, Inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Club} from "../../../domain/Club";
import {ClubService} from "./club.service";
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
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<SaveClubDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly clubService: ClubService,
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
        endDate: [this.club?.endDate ?? null, Validators.required]
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

  saveClub() {
    if (this.form.invalid) return;

    const alertDuration= 5000;

    // this.clubService.saveClub(this.form.value)

  }



  close() {
    this.dialogRef.close();
  }
}
