import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  EditBasacFacultyFormComponent
} from './edit-basac-faculty-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";


@NgModule({
  declarations: [
    EditBasacFacultyFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatCardModule
  ],
  exports: [
    EditBasacFacultyFormComponent
  ]
})
export class EditBasacFacultyFormModule {
}
