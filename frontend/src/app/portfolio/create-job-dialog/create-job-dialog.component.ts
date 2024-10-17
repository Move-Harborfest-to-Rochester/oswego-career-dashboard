import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export type CreateJobFormValues = {
  name: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  coop: boolean;
};

@Component({
  selector: 'create-job-dialog',
  templateUrl: './create-job-dialog.component.html',
  styleUrls: ['./create-job-dialog.component.less']
})
export class CreateJobDialogComponent {
  readonly title: string = 'Create Job';

  readonly form: FormGroup = this.fb.group({
    name: [''],
    location: [''],
    description: [''],
    startDate: [null],
    endDate: [null],
    coop: [false],
  });

  readonly today: Date = new Date();

  constructor(private readonly dialogRef: MatDialogRef<CreateJobDialogComponent>, private readonly fb: FormBuilder) { }

  createJob(): void {
    this.dialogRef.close(this.form.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
