import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupportFacultyComponent } from './edit-support-faculty.component';

describe('EditSupportFacultyComponent', () => {
  let component: EditSupportFacultyComponent;
  let fixture: ComponentFixture<EditSupportFacultyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSupportFacultyComponent]
    });
    fixture = TestBed.createComponent(EditSupportFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
