import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {BasacFacultyPatch, BasacFacultyService} from "./basac-faculty.service";
import {BasacFaculty} from "../../../domain/BasacFaculty";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'edit-basac-faculty-form',
  templateUrl: './edit-basac-faculty-form.component.html',
  styleUrls: ['./edit-basac-faculty-form.component.less']
})
export class EditBasacFacultyFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    operations: this.formBuilder.array([])
  });

  constructor(private readonly snackBar: MatSnackBar, readonly formBuilder: FormBuilder, private readonly service: BasacFacultyService) {
  }

  public get facultyOperations(): FormArray {
    return (this.form.get('operations') as FormArray);
  }

  ngOnInit() {
    this.service.getAll().subscribe(faculty => {
      this.updateFaculty(faculty);
    })
  }

  updateFaculty(allFaculty: BasacFaculty[]) {
    this.form = this.formBuilder.group({
      operations: this.formBuilder.array(
        allFaculty.map(faculty => this.formBuilder.group({
          op: this.formBuilder.control('replace'),
          id: this.formBuilder.control(faculty.id),
          value: this.formBuilder.group({
            name: this.formBuilder.control(faculty.name, {
              validators: [Validators.required]
            }),
            title: this.formBuilder.control(faculty.title),
            email: this.formBuilder.control(faculty.email)
          })
        }))
      )
    });
  }

  facultyControls(): AbstractControl[] {
    return this.facultyOperations.controls;
  }

  submit(formValues: BasacFacultyPatch) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.patch(formValues).subscribe((faculty) => {
      this.updateFaculty(faculty);
      this.snackBar.open('BASAC Office Faculty updated.', 'Close', {
        duration: 5000,
      });
    });
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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
