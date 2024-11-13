import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorDropdownInputComponent } from './major-dropdown-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MajorDropdownInputComponent', () => {
  let component: MajorDropdownInputComponent;
  let fixture: ComponentFixture<MajorDropdownInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      declarations: [MajorDropdownInputComponent],
    });
    fixture = TestBed.createComponent(MajorDropdownInputComponent);
    component = fixture.componentInstance;
    component.majorControl = new FormControl<DegreeProgramOperation | null>(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
