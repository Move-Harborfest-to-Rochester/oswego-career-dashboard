import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MajorDropdownInputComponent } from './major-dropdown-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    MajorDropdownInputComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],
  exports: [
    MajorDropdownInputComponent,
  ]
})
export class MajorDropdownInputModule { }
