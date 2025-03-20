import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable, of} from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {allClubs, allMajors} from '../../../util/dropdown-constants';

@Component({
  selector: 'app-club-dropdown',
  templateUrl: './club-dropdown.component.html',
  styleUrls: ['./club-dropdown.component.less']
})
export class ClubDropdownComponent implements OnInit {
  @Input() clubControl!: FormControl<string>;
  filteredClubs: Observable<string[]> = of([""]);

  ngOnInit() {
    this.filteredClubs = this.clubControl.valueChanges.pipe(
      startWith(this.clubControl.value || ''),
      map(value => this.filterClubs(value))
    );
  }

  displayFn(value: string): string {
    return value || '';
  }

  private filterClubs(filter: string): string[] {
    const filterValue = filter.toLowerCase();
    return allClubs.filter(option => option.toLowerCase().includes(filterValue));
  }
}
