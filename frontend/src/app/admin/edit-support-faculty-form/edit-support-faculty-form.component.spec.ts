import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupportFacultyFormComponent } from './edit-support-faculty-form.component';

describe('EditSupportFacultyFormComponent', () => {
  let component: EditSupportFacultyFormComponent;
  let fixture: ComponentFixture<EditSupportFacultyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSupportFacultyFormComponent]
    });
    fixture = TestBed.createComponent(EditSupportFacultyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
