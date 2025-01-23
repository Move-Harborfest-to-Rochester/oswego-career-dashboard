import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BasacFacultyService} from "./basac-faculty.service";
import {BasacFaculty} from "../../../domain/BasacFaculty";

@Component({
  selector: 'edit-basac-faculty-form',
  templateUrl: './edit-basac-faculty-form.component.html',
  styleUrls: ['./edit-basac-faculty-form.component.less']
})
export class EditBasacFacultyFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    faculty: this.formBuilder.array([])
  });

  constructor(private readonly formBuilder: FormBuilder, private readonly service: BasacFacultyService) {
  }

  ngOnInit() {
    this.service.getAll().subscribe(faculties => {
      this.form = this.formBuilder.group({
        faculty: this.formBuilder.array(
          faculties.map(faculty => this.formBuilder.group({
            op: this.formBuilder.control('replace'),
            id: this.formBuilder.control(faculty.id),
            name: this.formBuilder.control(faculty.name),
            title: this.formBuilder.control(faculty.title),
            email: this.formBuilder.control(faculty.email)
          }))
        )
      });
    })
  }

  facultyControls(): AbstractControl[] {
    return (this.form.get('faculty') as FormArray).controls;
  }

  getControlFrom(facultyControl: AbstractControl, name: string): FormControl {
    return facultyControl.get(name) as FormControl;
  }

  submit() {

  }

  deleteFacultyAtIndex(facultyControl: FormControl, index: number) {
    faculty.removeAt(index);
    if (facultyControl.get('op').value === 'add') {
      return;
    }
  }

  addNewFaculty() {

  }
}
