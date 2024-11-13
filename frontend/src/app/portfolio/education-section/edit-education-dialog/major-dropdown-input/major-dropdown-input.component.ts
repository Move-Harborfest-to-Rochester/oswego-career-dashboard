import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { allMajors as MAJORS } from 'src/app/util/major-list';

@Component({
  selector: 'major-dropdown-input',
  templateUrl: './major-dropdown-input.component.html',
  styleUrls: ['./major-dropdown-input.component.less']
})
export class MajorDropdownInputComponent {
  filteredMajors!: Observable<string[]>;

  inputMajorNameControl: FormControl<string | null>;
  @Input() majorNameControl!: FormControl<string>;
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.inputMajorNameControl = new FormControl<string>('');
  }

  ngOnInit() {
    this.inputMajorNameControl.setValue(this.majorNameControl.value ?? '');
    this.filteredMajors = this.inputMajorNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterMajors(value ?? ''))
    );
  }

  private filterMajors(filter: string): string[] {
    console.log('filtering majors', filter);
    const filterValue = filter.toLowerCase();
    return MAJORS.filter(major => major.toLowerCase().includes(filterValue));
  }

  onInputBlur(blurEvent: FocusEvent) {
    const value = (blurEvent.target as HTMLInputElement).value;
    this.setMajorNameOrClearIfInvalid(value);
  }

  private setMajorNameOrClearIfInvalid(majorName: string) {
    if (!MAJORS.includes(majorName)) {
      majorName = '';
      this.majorNameControl.setValue('');
    }
    this.majorNameControl.setValue(majorName);
  }
}

