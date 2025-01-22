import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBasacFacultyFormComponent } from './edit-basac-faculty-form.component';

describe('EditSupportFacultyFormComponent', () => {
  let component: EditBasacFacultyFormComponent;
  let fixture: ComponentFixture<EditBasacFacultyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBasacFacultyFormComponent]
    });
    fixture = TestBed.createComponent(EditBasacFacultyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
