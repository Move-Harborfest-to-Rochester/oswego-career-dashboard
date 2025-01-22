import { Component } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'edit-basac-faculty-form',
  templateUrl: './edit-basac-faculty-form.component.html',
  styleUrls: ['./edit-basac-faculty-form.component.less']
})
export class EditBasacFacultyFormComponent {
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
