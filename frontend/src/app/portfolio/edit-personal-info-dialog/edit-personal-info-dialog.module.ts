import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPersonalInfoDialogComponent } from './edit-personal-info-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [EditPersonalInfoDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  exports: [
    EditPersonalInfoDialogComponent
  ]
})
export class EditPersonalInfoDialogModule { }
