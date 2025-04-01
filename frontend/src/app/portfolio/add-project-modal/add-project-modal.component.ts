import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Project } from '../../../domain/Project';
import { validateEndDateBeforeStartDate } from 'src/app/util/validation-utils';

@Component({
    selector: 'app-add-project-modal',
    templateUrl: './add-project-modal.component.html',
    styleUrls: ['./add-project-modal.component.less']
})
export class AddProjectModalComponent {
    header: string;
    readonly today: Date = new Date();
    projectForm!: FormGroup;
    readonly project: Project;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.header = data.header || 'Add New Project';
      this.project = data.Project;
    }

    ngOnInit(): void {
      if (this.project) {
        this.header = 'Edit Project';
      }
      this.projectForm = this.fb.group({
        id: [this.project?.id ?? ''],
        name: [this.project?.name ?? '', Validators.required],
        description: [this.project?.description ?? '', Validators.required],
        startDate: [this.project?.startDate ?? null, Validators.required],
        endDate: [this.project?.endDate ?? null],
      }, {
        validators: this.dateRangeValidator
      });
    }

    dateRangeValidator(formControl: AbstractControl): ValidationErrors | null {
      const startDate = formControl.get('startDate')?.value;
      const endDate = formControl.get('endDate')?.value;

      return validateEndDateBeforeStartDate(startDate, endDate);
    }

    hasError(error: string): boolean {
      return this.projectForm.hasError(error) && (this.projectForm.touched || this.projectForm.dirty);
    }

    onSubmit() {
        if (this.projectForm.valid) {
            this.dialogRef.close(this.projectForm.value);
        }
    }
    onClose(){
        this.dialogRef.close();
    }
}
