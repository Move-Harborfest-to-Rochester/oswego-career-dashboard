import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import {BasacFacultyPatch, BasacFacultyService} from "./basac-faculty.service";

@Component({
  selector: 'edit-basac-faculty-form',
  templateUrl: './edit-basac-faculty-form.component.html',
  styleUrls: ['./edit-basac-faculty-form.component.less']
})
export class EditBasacFacultyFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    operations: this.formBuilder.array([])
  });

  constructor(private readonly formBuilder: FormBuilder, private readonly service: BasacFacultyService) {
  }

  public get facultyOperations(): FormArray {
    return (this.form.get('operations') as FormArray);
  }

  ngOnInit() {
    this.service.getAll().subscribe(faculties => {
      this.form = this.formBuilder.group({
        operations: this.formBuilder.array(
          faculties.map(faculty => this.formBuilder.group({
            op: this.formBuilder.control('replace'),
            id: this.formBuilder.control(faculty.id),
            value: this.formBuilder.group({
              name: this.formBuilder.control(faculty.name),
              title: this.formBuilder.control(faculty.title),
              email: this.formBuilder.control(faculty.email)
            })
          }))
        )
      });
    })
  }

  facultyControls(): AbstractControl[] {
    return this.facultyOperations.controls;
  }

  submit(formValues: BasacFacultyPatch) {
    this.service.patch(formValues ).subscribe();
  }

  deleteFacultyAtIndex(facultyControl: AbstractControl, index: number) {
    const operations = this.facultyOperations;
    if (facultyControl.get('op')?.value === 'add') {
      operations.removeAt(index);
      return;
    }
    facultyControl.get('op')?.setValue('remove');
  }

  addNewFaculty() {
    this.facultyOperations.push(this.formBuilder.group({
      op: this.formBuilder.control('add'),
      value: this.formBuilder.group({
        name: this.formBuilder.control(''),
        title: this.formBuilder.control(''),
        email: this.formBuilder.control('')
      })
    }));
  }

  isDeleted(facultyControl: AbstractControl): boolean {
    return facultyControl.get('op')?.value === 'remove';
  }

  getValueFromControl(facultyControl: AbstractControl): FormGroup {
    return facultyControl.get('value') as FormGroup;
  }
}
