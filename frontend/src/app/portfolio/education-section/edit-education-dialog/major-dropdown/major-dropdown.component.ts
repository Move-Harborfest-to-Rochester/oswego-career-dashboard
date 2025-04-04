import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {allMajors} from "../../../../util/dropdown-constants";

@Component({
  selector: 'major-dropdown',
  templateUrl: './major-dropdown.component.html',
  styleUrls: ['./major-dropdown.component.less']
})
export class MajorDropdownComponent {
  filteredMajors!: Observable<string[]>;
  @Input() majorNameControl!: FormControl<string>;
  @Output() onDelete = new EventEmitter<number>();

  ngOnInit() {
    this.filteredMajors = this.majorNameControl.valueChanges
      .pipe(
        startWith(this.majorNameControl.value ?? ''),
        map(value => this.filterMajors(value))
      );
  }

  displayFn(value: string): string {
    return value ?? '';
  }

  private filterMajors(filter: string): string[] {
    const filterValue = filter.toLowerCase();
    return allMajors.filter(option => option.toLowerCase().includes(filterValue));
  }
}
