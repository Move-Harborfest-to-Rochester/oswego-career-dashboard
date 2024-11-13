import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { map, Observable, startWith } from 'rxjs';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';
import { allMajors as MAJORS } from 'src/app/util/major-list';

function createMajor(name: string): DegreeProgramOperation {
  return { operation: 'Create', name, isMinor: false };
}

@Component({
  selector: 'major-dropdown-input',
  templateUrl: './major-dropdown-input.component.html',
  styleUrls: ['./major-dropdown-input.component.less']
})
export class MajorDropdownInputComponent {
  filteredMajors!: Observable<string[]>;

  @Input() majorControl!: FormControl<DegreeProgramOperation | null>;
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    this.filteredMajors = this.majorControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterMajors(name as string) : MAJORS.slice();
      }),
    );
  }

  onSelectionChange(event: MatOptionSelectionChange<string>) {
    this.setMajorName(event.source.value);
  }

  setMajorName(value: string) {
    const currentControlValue = this.majorControl.value;
    if (currentControlValue?.name === value) {
      return;
    }
    if (!MAJORS.includes(value)) {
      value = '';
    }
    if (currentControlValue) {
      this.majorControl.setValue({ ...currentControlValue, name: value });
    } else {
      this.majorControl.setValue(createMajor(value));
    }
  }

  onInputBlur(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.setMajorName(value);
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.setValueToNullIfEmpty(value);
  }

  setValueToNullIfEmpty(value: string) {
    if (value) {
      return;
    }
    console.log('empty, setting to null')
    this.majorControl.setValue(null);
  }

  filterMajors(value: string): string[] {
    const filterValue = value.toLowerCase();

    return MAJORS
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  displayFn(value: DegreeProgramOperation): string {
    return value?.name || '';
  }
}

