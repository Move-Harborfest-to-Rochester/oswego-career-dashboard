import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Project } from '../../../domain/Project';

@Component({
    selector: 'app-add-project-modal',
    templateUrl: './add-project-modal.component.html',
    styleUrls: ['./add-project-modal.component.less']
})
export class AddProjectModalComponent {
    header: string;
    readonly today: Date = new Date();
    readonly projectForm: FormGroup = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, this.dateRangeValidator],
    });
    readonly project: Project;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.header = data.header || 'Add New Project';
      this.project = data.Project;
    }

    dateRangeValidator(endDateControl: AbstractControl): ValidationErrors | null {
      const startDate: Date | undefined = endDateControl.parent?.get('startDate')?.value;
      const endDate: Date | undefined = endDateControl.value;

      if (!endDate || !startDate) {
        return null;
      }
      if (endDate > new Date()) {
        return { futureEndDate: true };
      }
      if (endDate < startDate) {
        return { endDateBeforeStartDate: true };
      }
      return null;
    }

    ngOnInit(): void {
      if (this.project) {
        this.header = 'Edit Project';
      }
      this.projectForm.reset({
        id: this.project?.id ?? '',
        name: this.project?.name ?? '',
        description: this.project?.description ?? '',
        startDate: this.project?.startDate ?? null,
        endDate: this.project?.endDate ?? null,
      })
    }

    onSubmit() {
        if (this.projectForm.valid) {
            this.dialogRef.close(this.projectForm.value);
        }else{
          alert('Must fill all elements of form')
        }
    }
    onClose(){
        this.dialogRef.close();
    }
}
