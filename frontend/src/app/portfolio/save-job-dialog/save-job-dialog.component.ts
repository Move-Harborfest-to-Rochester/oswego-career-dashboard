import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from 'src/domain/Job';
import { JobService } from '../job/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

function validateDateRange(startDate: Date | null, endDate: Date | null): ValidationErrors | null {
  if (!endDate || !startDate) {
    return null;
  }
  if (endDate < startDate) {
    return { endDateBeforeStartDate: true };
  }
  return null;
}

@Component({
  selector: 'save-job-dialog',
  templateUrl: './save-job-dialog.component.html',
  styleUrls: ['./save-job-dialog.component.less']
})
export class SaveJobDialogComponent {
  title: string = 'Create Job';

  readonly today: Date = new Date();
  form!: FormGroup;

  constructor(
    private readonly jobService: JobService,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<SaveJobDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly job?: Job
  ) {
  }

  ngOnInit(): void {
    if (this.job) {
      this.title = 'Edit Job';
    }
    this.form = this.fb.group({
      id: [this.job?.id ?? ''],
      name: [this.job?.name ?? '', Validators.required],
      location: [this.job?.location ?? '', Validators.required],
      description: [this.job?.description ?? ''],
      startDate: [this.job?.startDate ?? null, [Validators.required]],
      endDate: [this.job?.endDate ?? null],
      coop: [this.job?.isCoop ?? false],
    }, {
      validators: this.dateRangeValidator
    });
  }

  dateRangeValidator(formControl: AbstractControl): ValidationErrors | null {
    const startDate = formControl.get('startDate')?.value;
    const endDate = formControl.get('endDate')?.value;

    return validateDateRange(startDate, endDate);
  }

  hasError(error: string): boolean {
    console.log(error, this.form.errors);
    return this.form.hasError(error) && (this.form.touched || this.form.dirty)
  }

  saveJob(): void {
      console.log(this.form.errors);
      if (this.form.invalid) {
        return;
      }
      const alertDurationMs = 5000;
      this.jobService.saveJob(this.form.value).subscribe({
        next: (job) => {
          this.dialogRef.close(job);
          this.snackBar.open('Job saved successfully.', 'Close', {
            duration: alertDurationMs,
          });
        },
        error: (error: unknown) => {
          console.error(error);
          this.snackBar.open('Failed to save job.', 'Close', {
            duration: alertDurationMs,
          });
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}

