import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBasacFacultyComponent } from './edit-basac-faculty.component';

describe('EditSupportFacultyComponent', () => {
  let component: EditBasacFacultyComponent;
  let fixture: ComponentFixture<EditBasacFacultyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBasacFacultyComponent]
    });
    fixture = TestBed.createComponent(EditBasacFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
