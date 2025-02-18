import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MajorDropdownComponent} from "./major-dropdown.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    MajorDropdownComponent
  ],
  exports: [
    MajorDropdownComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MajorDropdownModule {
}
