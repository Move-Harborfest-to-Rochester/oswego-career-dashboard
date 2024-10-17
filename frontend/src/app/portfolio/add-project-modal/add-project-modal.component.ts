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

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AddProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.projectForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });
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
