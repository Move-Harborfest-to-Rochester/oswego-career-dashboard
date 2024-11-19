import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MajorDropdownComponent} from './major-dropdown.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {CommonModule} from "@angular/common";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {of} from "rxjs";

describe('MajorDropdownComponent', () => {
  let component: MajorDropdownComponent;
  let fixture: ComponentFixture<MajorDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MajorDropdownComponent],
      imports: [
        CommonModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
      ]
    });
    fixture = TestBed.createComponent(MajorDropdownComponent);
    component = fixture.componentInstance;
    component.majorNameControl = new FormControl('', [Validators.required]) as FormControl<string>;
    component.filteredMajors = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
