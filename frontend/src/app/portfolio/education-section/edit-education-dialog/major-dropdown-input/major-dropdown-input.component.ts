import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'major-dropdown-input',
  templateUrl: './major-dropdown-input.component.html',
  styleUrls: ['./major-dropdown-input.component.less']
})
export class MajorDropdownInputComponent {
  private readonly allMajors: string[] = [
    'Accounting',
    'Business Administration',
    'Finance',
    'Human Resource Management',
    'Marketing',
    'Operations Management and Information Systems',
    'Risk Management and Insurance',
  ];
  filteredMajors: string[] = this.allMajors;

  @Input() majorControl!: FormControl;

  ngOnInit(): void {
    this.majorControl.valueChanges.subscribe((value) => {
      this.filteredMajors = this.allMajors.filter((major) => {
        return major.toLowerCase().includes(value.toLowerCase());
      });
    });
  }
}
