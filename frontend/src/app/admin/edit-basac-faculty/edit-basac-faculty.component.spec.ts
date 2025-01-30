import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditBasacFacultyComponent} from './edit-basac-faculty.component';
import {MockComponent} from "ng-mocks";
import {
  EditBasacFacultyFormComponent
} from "../edit-basac-faculty-form/edit-basac-faculty-form.component";

describe('EditBasacFacultyComponent', () => {
  let component: EditBasacFacultyComponent;
  let fixture: ComponentFixture<EditBasacFacultyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBasacFacultyComponent],
      imports: [
        MockComponent(EditBasacFacultyFormComponent),
      ],
    });
    fixture = TestBed.createComponent(EditBasacFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
