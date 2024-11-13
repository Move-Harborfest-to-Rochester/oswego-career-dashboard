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
import { allMajors } from 'src/app/util/major-list';

describe('MajorDropdownInputComponent', () => {
  let component: MajorDropdownInputComponent;
  let fixture: ComponentFixture<MajorDropdownInputComponent>;
  let majorControl: FormControl<DegreeProgramOperation | null>;

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
    majorControl = new FormControl<DegreeProgramOperation | null>({
      operation: 'Create',
      name: allMajors[0],
      isMinor: false,
    });
    component.majorNameControl = majorControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set major name if valid', () => {
    const majorName = allMajors[0];
    majorControl.setValue({ operation: 'Edit', name: majorName, isMinor: false });

    component.setMajorNameOrDefault(majorName);

    expect(majorControl.value).toEqual({ operation: 'Edit', name: majorName, isMinor: false });
  });

  it('should empty major when setting invalid major name', () => {
    const majorName = 'Not a Real Major';
    majorControl.setValue({ operation: 'Edit', name: majorName, isMinor: false });

    component.setMajorNameOrDefault(majorName);

    expect(majorControl.value).toEqual({ operation: 'Edit', name: '', isMinor: false });
  });

  it('should get major name from major', () => {
    const majorName = component.getMajorName({ operation: 'Edit', name: allMajors[0], isMinor: false });

    expect(majorName).toEqual(allMajors[0]);
  });
});
