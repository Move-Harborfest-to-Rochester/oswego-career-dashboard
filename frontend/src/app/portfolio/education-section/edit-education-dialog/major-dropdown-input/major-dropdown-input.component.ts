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

  private filterMajors(filter: string): string[] {
    const filterValue = filter.toLowerCase();

    return MAJORS
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectionChange(selectionChangeEvent: MatOptionSelectionChange<string>) {
    this.setMajorName(selectionChangeEvent.source.value);
  }

  onInputBlur(blurEvent: FocusEvent) {
    const value = (blurEvent.target as HTMLInputElement).value;
    this.setMajorName(value);
  }

  setMajorName(majorName: string) {
    const currentControlValue = this.majorControl.value;
    if (!MAJORS.includes(majorName)) {
      majorName = '';
    }
    if (currentControlValue) {
      this.majorControl.setValue({ ...currentControlValue, name: majorName });
    } else {
      this.majorControl.setValue(createMajor(majorName));
    }
  }

  getMajorName(major: DegreeProgramOperation): string {
    return major?.name || '';
  }
}

