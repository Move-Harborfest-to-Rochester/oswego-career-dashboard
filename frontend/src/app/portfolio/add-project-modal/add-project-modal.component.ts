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
            endDate: [''],
        });
    }

    onSubmit() {
        if (this.projectForm.valid) {
            alert('Form Submitted: ' + JSON.stringify(this.projectForm.value, null, 2));
            this.dialogRef.close(this.projectForm.value);
        }else{
          alert('Must fill all elements of form')
        }
    }
    onClose(){
        this.dialogRef.close();
    }
}
