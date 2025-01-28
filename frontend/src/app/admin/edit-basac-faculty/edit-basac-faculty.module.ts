import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBasacFacultyComponent } from './edit-basac-faculty.component';
import {EditBasacFacultyFormModule} from "../edit-basac-faculty-form/edit-basac-faculty-form.module";



@NgModule({
  declarations: [
    EditBasacFacultyComponent
  ],
  imports: [
    CommonModule,
    EditBasacFacultyFormModule
  ],
  exports: [EditBasacFacultyComponent]
})
export class EditBasacFacultyModule { }
