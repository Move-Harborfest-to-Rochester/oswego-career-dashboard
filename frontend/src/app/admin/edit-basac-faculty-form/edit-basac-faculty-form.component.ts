import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import {BasacFacultyService} from "./basac-faculty.service";

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

  public get faculty(): FormArray {
    return (this.form.get('faculty') as FormArray);
  }

  ngOnInit() {
    this.service.getAll().subscribe(faculties => {
      this.form = this.formBuilder.group({
        faculty: this.formBuilder.array(
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
    return this.faculty.controls;
  }

  getControlFrom(facultyControl: AbstractControl, name: string): FormControl {
    return facultyControl.get(name) as FormControl;
  }

  submit(formValues: Record<string, unknown>) {
    console.debug(formValues);
  }

  deleteFacultyAtIndex(facultyControl: AbstractControl, index: number) {
    const faculty = this.form.get('faculty') as FormArray;
    if (facultyControl.get('op')?.value === 'add') {
      faculty.removeAt(index);
      return;
    }
    facultyControl.get('op')?.setValue('delete');
  }

  addNewFaculty() {
    this.faculty.push(this.formBuilder.group({
      op: this.formBuilder.control('add'),
      name: this.formBuilder.control(''),
      title: this.formBuilder.control(''),
      email: this.formBuilder.control('')
    }));
  }

  isDeleted(facultyControl: AbstractControl): boolean {
    return facultyControl.get('op')?.value === 'delete';
  }

  getValueFromControl(facultyControl: AbstractControl): FormGroup {
    return facultyControl.get('value') as FormGroup;
  }

  protected readonly FormGroup = FormGroup;
}
