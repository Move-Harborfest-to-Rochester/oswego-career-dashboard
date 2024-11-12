import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorDropdownInputComponent } from './major-dropdown-input.component';

describe('MajorDropdownInputComponent', () => {
  let component: MajorDropdownInputComponent;
  let fixture: ComponentFixture<MajorDropdownInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MajorDropdownInputComponent]
    });
    fixture = TestBed.createComponent(MajorDropdownInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
