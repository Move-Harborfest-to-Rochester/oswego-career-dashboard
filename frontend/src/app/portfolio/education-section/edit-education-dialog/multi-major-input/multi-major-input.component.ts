import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, ValidatorFn,} from '@angular/forms';
import {DegreeProgramOperation} from 'src/app/portfolio/portfolio.service';

export type DegreeProgramOperationGroup = FormGroup<{
  id: FormControl<string | null>;
  operation: FormControl<'Create' | 'Edit' | 'Delete' | null>;
  name: FormControl<string | null>;
  isMinor: FormControl<boolean | null>;
}>

@Component({
  selector: 'multi-major-input',
  templateUrl: './multi-major-input.component.html',
  styleUrls: ['./multi-major-input.component.less'],
})
export class MultiMajorInputComponent {
  @Input() label!: string;
  readonly addText: string = 'Add Major';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<DegreeProgramOperationGroup>;
  @Input() formArrayName!: string;
  @Input() majorNameValidators!: ValidatorFn[];
  deleted: Set<number>;
  @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.deleted = new Set();
  }

  ngOnInit(): void {
    const currentMajors = this.formArray.controls;
    for (const control of currentMajors) {
      const newValue = control.value;
      newValue.operation = 'Edit';
      control.setValue(newValue as any);
    }
    ;
  }

  addInput(): void {
    this.formArray.push(new FormGroup({
      id: new FormControl(''),
      operation: new FormControl<'Create' | 'Edit' | 'Delete'>('Create'),
      name: new FormControl('', this.majorNameValidators),
      isMinor: new FormControl(false),
    }));
  }

  majorNameControls(): FormControl<string>[] {
    return this.formArray.controls.map((control) => control.get('name') as FormControl<string>);
  }

  setValue(control: FormControl<DegreeProgramOperation>, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentValue = control.value;
    currentValue.name = target.value;
    if (currentValue.id) {
      currentValue.operation = 'Edit';
    }
    control.setValue(currentValue);
  }

  deleteMajor(index: number) {
    const control = this.formArray.at(index);
    if (this.formArray.at(index).value.operation === 'Create') {
      this.deleted.delete(index);
      this.formArray.removeAt(index);
    } else {
      this.deleted.add(index);
    }
    control.get('name')?.setValue('deleted');
    control.get('operation')?.setValue('Delete');
  }

  isDeleted(index: number): boolean {
    return this.deleted.has(index);
  }
}

