import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';

function createMajor(name: string): DegreeProgramOperation {
  return { operation: 'Create', name, isMinor: false };
}

@Component({
  selector: 'major-dropdown-input',
  templateUrl: './major-dropdown-input.component.html',
  styleUrls: ['./major-dropdown-input.component.less']
})
export class MajorDropdownInputComponent {
  private readonly allMajors: DegreeProgramOperation[] = [
    createMajor('Accounting'),
    createMajor('Business Administration'),
    createMajor('Finance'),
    createMajor('Human Resource Management'),
    createMajor('Marketing'),
    createMajor('Operations Management and Information Systems'),
    createMajor('Risk Management and Insurance'),
  ];
  filteredMajors!: Observable<DegreeProgramOperation[]>;

  @Input() majorControl!: FormControl;
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    this.filteredMajors = this.majorControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterMajors(name as string) : this.allMajors.slice();
      }),
    );
  }

  displayMajorName(major: DegreeProgramOperation): string {
    return major.name;
  }

  filterMajors(value: string): DegreeProgramOperation[] {
    const filterValue = value.toLowerCase();

    return this.allMajors.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
