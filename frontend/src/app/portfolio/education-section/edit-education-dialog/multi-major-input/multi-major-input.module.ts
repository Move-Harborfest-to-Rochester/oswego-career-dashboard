import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MultiMajorInputComponent} from './multi-major-input.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MajorDropdownModule} from "../major-dropdown/major-dropdown.module";

@NgModule({
  declarations: [MultiMajorInputComponent],
  exports: [MultiMajorInputComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MajorDropdownModule,
  ]
})
export class MultiMajorInputModule {
}
