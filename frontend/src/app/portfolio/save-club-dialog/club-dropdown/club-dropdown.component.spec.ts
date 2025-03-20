import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDropdownComponent } from './club-dropdown.component';
import {CommonModule} from "@angular/common";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {of} from "rxjs";

fdescribe('ClubDropdownComponent', () => {
  let component: ClubDropdownComponent;
  let fixture: ComponentFixture<ClubDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubDropdownComponent], imports: [ CommonModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,]
    });
    fixture = TestBed.createComponent(ClubDropdownComponent);
    component = fixture.componentInstance;
    component.clubControl = new FormControl('', [Validators.required]) as FormControl<string>;
    component.filteredClubs = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
