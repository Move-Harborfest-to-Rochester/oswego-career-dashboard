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
import { MatOptionSelectionChange } from '@angular/material/core';

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
    component.majorControl = majorControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update empty value of new major on selection', () => {
    const majorName = '';

    component.onSelectionChange({
      source: {
        value: '',
      }
    } as unknown as MatOptionSelectionChange<string>);

    expect(majorControl.value).toEqual({ operation: 'Create', name: majorName, isMinor: false });
  });

  it('should update name of new major on selection', () => {
    const majorName = allMajors[0];

    component.onSelectionChange({
      source: {
        value: majorName,
      }
    } as unknown as MatOptionSelectionChange<string>);

    expect(majorControl.value).toEqual({ operation: 'Create', name: majorName, isMinor: false });
  });

  it('should update name of existing major on selection', () => {
    const majorName = allMajors[0];
    majorControl.setValue({ operation: 'Edit', name: majorName, isMinor: false });

    component.onSelectionChange({
      source: {
        value: majorName,
      }
    } as unknown as MatOptionSelectionChange<string>);

    expect(majorControl.value).toEqual({ operation: 'Edit', name: majorName, isMinor: false });
  });
});
