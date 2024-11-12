import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MultiMajorInputComponent } from './multi-major-input.component';
import { MajorDropdownInputModule } from "../major-dropdown-input/major-dropdown-input.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
        MajorDropdownInputModule,
        MatAutocompleteModule,
    ]
})
export class MultiMajorInputModule {}
