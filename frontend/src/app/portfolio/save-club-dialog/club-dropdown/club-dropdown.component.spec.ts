import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClubDropdownComponent} from './club-dropdown.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {of} from 'rxjs';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ClubDropdownComponent', () => {
  let component: ClubDropdownComponent;
  let fixture: ComponentFixture<ClubDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubDropdownComponent],
      imports: [MatFormFieldModule, MatAutocompleteModule, ReactiveFormsModule, MatInputModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(ClubDropdownComponent);
    component = fixture.componentInstance;
    component.filteredClubs = of([]);
    component.clubControl = new FormControl('') as FormControl<string>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
