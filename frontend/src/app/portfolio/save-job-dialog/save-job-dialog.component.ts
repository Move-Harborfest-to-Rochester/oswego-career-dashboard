import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Job } from 'src/domain/Job';
import { JobService } from '../job/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'save-job-dialog',
  templateUrl: './save-job-dialog.component.html',
  styleUrls: ['./save-job-dialog.component.less']
})
export class SaveJobDialogComponent {
  title: string = 'Create Job';

  readonly today: Date = new Date();
  readonly form: FormGroup = this.fb.group({
    id: [''],
    name: [''],
    location: [''],
    description: [''],
    startDate: [null],
    endDate: [null, this.dateRangeValidator],
    coop: [false],
  });

  constructor(
    private readonly jobService: JobService,
    private readonly snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<SaveJobDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public readonly job?: Job
  ) {
  }

  dateRangeValidator(endDateControl: AbstractControl): ValidationErrors | null {
    const startDate: Date = endDateControl.parent?.get('startDate')?.value;
    const endDate: Date = endDateControl.value;

    if (!endDate) {
      return null;
    }
    if (endDate > new Date()) {
      return { futureEndDate: true };
    }
    if (startDate > endDate) {
      return { endDateBeforeStartDate: true };
    }
    return null;
  };

  ngOnInit(): void {
    if (this.job) {
      this.title = 'Edit Job';
    }
    this.form.reset({
      id: this.job?.id ?? '',
      name: this.job?.name ?? '',
      location: this.job?.location ?? '',
      description: this.job?.description ?? '',
      startDate: this.job?.startDate ?? null,
      endDate: this.job?.endDate ?? null,
      coop: this.job?.isCoop ?? false,
    })
  }

  hasError(error: string): boolean {
    console.log(error, this.form.errors);
    return this.form.hasError(error);
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
