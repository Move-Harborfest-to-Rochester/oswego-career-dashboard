import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSupportFacultyFormComponent } from './edit-support-faculty-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    EditSupportFacultyFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    EditSupportFacultyFormComponent
  ]
})
export class EditSupportFacultyFormModule { }
