import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  EditBasacFacultyFormComponent
} from './edit-basac-faculty-form.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";

describe('EditBasacFacultyFormComponent', () => {
  let component: EditBasacFacultyFormComponent;
  let fixture: ComponentFixture<EditBasacFacultyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBasacFacultyFormComponent],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: () => {
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(EditBasacFacultyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
