import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-project-modal',
    templateUrl: './add-project-modal.component.html',
    styleUrls: ['./add-project-modal.component.less']
})
export class AddProjectModalComponent {
    projectForm: FormGroup;
    header: string;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.header = data.header || 'Add New Project';
      this.projectForm = this.fb.group({
        name: [data.Project?.name || '', Validators.required],
        description: [data.Project?.description || '', Validators.required],
        startDate: [data.Project?.startDate || '', Validators.required],
        endDate: [data.Project?.endDate || ''],

        });
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
