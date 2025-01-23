import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BasacFacultyService} from "./basac-faculty.service";

@Component({
  selector: 'edit-basac-faculty-form',
  templateUrl: './edit-basac-faculty-form.component.html',
  styleUrls: ['./edit-basac-faculty-form.component.less']
})
export class EditBasacFacultyFormComponent implements OnInit {
  form: FormGroup = new FormGroup([]);

  constructor(private readonly service: BasacFacultyService) {
  }

  ngOnInit() {
    this.service.getAll().subscribe(faculties => {
      console.log(faculties);
    })
  }

  submit() {

  }

  deleteFaculty() {

  }

  addNewFaculty() {

  }
}
