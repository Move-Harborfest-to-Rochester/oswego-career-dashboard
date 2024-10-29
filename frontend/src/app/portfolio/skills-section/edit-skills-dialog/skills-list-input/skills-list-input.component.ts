import {Component, Input, Output} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SkillsOperation } from 'src/app/portfolio/portfolio.service';
import {Skill} from "../../../../../domain/Skill";

@Component({
  selector: 'skills-list-input-component',
  templateUrl: './skills-list-input.component.html',
  styleUrls: ['./skills-list-input.component.less'],
})
export class SkillsListInputComponent {
  @Input() label!: string;
  @Input() addText: string = 'Add';
  @Input() formGroup!: FormGroup;
  @Input() formArray!: FormArray<FormControl<SkillsOperation | null>>;
  @Input() formArrayName!: string;
  @Input() defaultValue!: SkillsOperation;
  deleted: Set<number> = new Set();

  constructor(private formBuilder: FormBuilder) {}

  addInput(): void {
    this.formArray.push(
      this.formBuilder.control<SkillsOperation>(
        this.defaultValue,
      )
    );
  }

  arrayControls(): FormControl<SkillsOperation>[] {
    return this.formArray.controls as FormControl<SkillsOperation>[];
  }

  getValue(operation: SkillsOperation): string {
    return operation.name;
  }

  setValue(control: FormControl<SkillsOperation>, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentValue = control.value;
    currentValue.name = target.value;
    if (currentValue.id) {
      currentValue.operation = 'Edit';
    }
    control.setValue(currentValue);
  }

  delete(control: FormControl<SkillsOperation>, index: number) {
    const currentValue = control.value;
    this.deleted.add(index);
    if (currentValue.operation === 'Create') {
      return;
    }
    currentValue.operation = 'Delete';
    control.setValue(currentValue);
  }
}
