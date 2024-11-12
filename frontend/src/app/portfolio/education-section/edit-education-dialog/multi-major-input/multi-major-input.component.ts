import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';

@Component({
  selector: 'multi-major-input',
  templateUrl: './multi-major-input.component.html',
  styleUrls: ['./multi-major-input.component.less'],
})
export class MultiMajorInputComponent {
  @Input() label!: string;
  readonly addText: string = 'Add Major';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<FormControl<DegreeProgramOperation | null>>;
  @Input() formArrayName!: string;
  deleted: Set<number> = new Set();

  constructor(private formBuilder: FormBuilder) {}

  getDefaultValue(): DegreeProgramOperation {
    return {
      operation: 'Create',
      name: '',
      isMinor: false,
    };
  }

  addInput(): void {
    this.formArray.push(
      this.formBuilder.control<DegreeProgramOperation>(
        this.getDefaultValue(),
        Validators.required
      )
    );
  }

  arrayControls(): FormControl<DegreeProgramOperation>[] {
    return this.formArray.controls as FormControl<DegreeProgramOperation>[];
  }

  getValue(operation: DegreeProgramOperation): string {
    return operation.name;
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

  delete(control: FormControl<DegreeProgramOperation>, index: number) {
    const currentValue = control.value;
    if (currentValue.operation === 'Create') {
      this.deleted.delete(index);
      this.formArray.removeAt(index);
      return;
    }
    this.deleted.add(index);
    currentValue.operation = 'Delete';
    control.setValue(currentValue);
  }
}

