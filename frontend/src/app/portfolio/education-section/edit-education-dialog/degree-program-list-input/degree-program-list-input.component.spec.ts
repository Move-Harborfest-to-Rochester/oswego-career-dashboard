import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DegreeProgramListInputComponent } from './degree-program-list-input.component';

describe('ListInputComponent', () => {
  let component: DegreeProgramListInputComponent;
  let fixture: ComponentFixture<DegreeProgramListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeProgramListInputComponent]
    });
    fixture = TestBed.createComponent(DegreeProgramListInputComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      majors: new FormArray([]),
      minors: new FormArray([])
    });
    component.formGroup = form;
    component.formArray = form.get(
      'majors'
    ) as unknown as FormArray<FormControl>;
    component.formArrayName = 'majors';
    component.label = 'Majors';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
