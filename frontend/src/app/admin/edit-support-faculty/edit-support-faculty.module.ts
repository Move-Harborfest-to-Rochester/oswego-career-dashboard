import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditSupportFacultyComponent} from './edit-support-faculty.component';
import {
  EditSupportFacultyFormModule
} from "../edit-support-faculty-form/edit-support-faculty-form.module";


@NgModule({
  declarations: [
    EditSupportFacultyComponent
  ],
  imports: [
    CommonModule,
    EditSupportFacultyFormModule
  ],
  exports: [EditSupportFacultyComponent]
})
export class EditSupportFacultyModule {
}
