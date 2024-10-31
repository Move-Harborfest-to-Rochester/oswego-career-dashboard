import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    endDate: [null],
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

  saveJob(): void {
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
