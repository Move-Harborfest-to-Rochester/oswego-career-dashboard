import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'edit-support-faculty-form',
  templateUrl: './edit-support-faculty-form.component.html',
  styleUrls: ['./edit-support-faculty-form.component.less']
})
export class EditSupportFacultyFormComponent {
  form: FormGroup = new FormGroup([]);

  constructor() {
  }

  submit() {

  }

  deleteFaculty() {

  }

  addNewFaculty() {

  }
}
