import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBasacFacultyComponent } from './edit-basac-faculty.component';
import {EditBasacFacultyFormModule} from "../edit-basac-faculty-form/edit-basac-faculty-form.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";



@NgModule({
  declarations: [
    EditBasacFacultyComponent
  ],
    imports: [
        CommonModule,
        EditBasacFacultyFormModule,
        MatButtonModule,
        MatIconModule
    ],
  exports: [EditBasacFacultyComponent]
})
export class EditBasacFacultyModule { }
