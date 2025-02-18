import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  entityId: string;
  action: string;
  undoable?: boolean;
  onConfirm: () => unknown;
  title: string;
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  readonly form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmationDialogData,
    private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [data.entityId],
    });
  }

  close() {
    this.dialogRef.close();
  }

  onConfirm() {
    return this.data.onConfirm();
  }

  get message() {
    return `Are you sure you want to ${this.data.action}? ${this.data.undoable ? '' : 'This action can not be undone.'}`;
  }

  get title() {
    return this.data.title;
  }
}
