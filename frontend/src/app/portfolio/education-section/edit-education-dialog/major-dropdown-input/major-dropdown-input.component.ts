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

  onChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    if (!newValue) {
      this.majorControl.setValue(null);
      return;
    }
  }

  onSelectionChange(event: MatOptionSelectionChange<string>) {
    const currentValue = this.majorControl.value;
    console.log('selection change', currentValue);
    this.setValueToMajor(event.source.value);
    const newValue = this.majorControl.value;
    console.log('new value', newValue);
    this.majorControl.setValue(newValue);
  }

  onInputBlur(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.setIfValidMajor(value);
  }

  setIfValidMajor(value: string) {
    if (MAJORS.includes(value)) {
      this.setValueToMajor(value);
      return;
    }
    this.setValueToMajor('');
  }

  setValueToMajor(value: string) {
    const currentControlValue = this.majorControl.value;
    console.log('set to major; current value:', currentControlValue);
    if (currentControlValue?.name === value) {
      return;
    }
    if (!currentControlValue) {
      console.log('no value, creating new major');
      this.majorControl.setValue(createMajor(value));
    } else {
      console.log('updating existing major');
      this.majorControl.setValue({ ...currentControlValue, name: value });
    }
    console.log('new value', this.majorControl.value);
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

