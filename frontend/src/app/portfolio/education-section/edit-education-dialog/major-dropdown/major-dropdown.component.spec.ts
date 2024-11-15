import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MajorDropdownComponent} from './major-dropdown.component';

describe('NewAutocompleteComponent', () => {
  let component: MajorDropdownComponent;
  let fixture: ComponentFixture<MajorDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MajorDropdownComponent]
    });
    fixture = TestBed.createComponent(MajorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
