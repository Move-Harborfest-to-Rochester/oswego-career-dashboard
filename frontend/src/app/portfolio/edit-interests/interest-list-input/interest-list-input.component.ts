import {Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {InterestOperation, SkillsOperation} from "../../portfolio.service";

@Component({
  selector: 'app-interest-list-input',
  templateUrl: './interest-list-input.component.html',
  styleUrls: ['./interest-list-input.component.less']
})
export class InterestListInputComponent {
  @Input() label!: string;
  @Input() addText: string = 'Add';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<FormControl<InterestOperation | null>>;
  @Input() formArrayName!: string;
  @Input() defaultValue!: InterestOperation;
  deleted: Set<number> = new Set();

  constructor(private formBuilder: FormBuilder) {}


  addInput(): void {
    this.formArray.push(
      this.formBuilder.control<InterestOperation>(
        this.defaultValue,
      )
    );
  }

  arrayControls(): FormControl<InterestOperation>[] {
    return this.formArray.controls as FormControl<InterestOperation>[];
  }
  getValue(operation: InterestOperation): string {
    return operation.name;
  }

  setValue(control: FormControl<InterestOperation>, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentValue = control.value;
    currentValue.name = target.value;
    if (currentValue.id) {
      currentValue.operation = 'Edit';
    }
    control.setValue(currentValue);
  }

  delete(control: FormControl<InterestOperation>, index: number) {
    const currentValue = control.value;
    this.deleted.add(index);
    if (currentValue.operation === 'Create') {
      return;
    }
    currentValue.operation = 'Delete';
    control.setValue(currentValue);
  }

}
