import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { DegreeProgramListInputComponent } from './degree-program-list-input.component';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';

describe('ListInputComponent', () => {
  let component: DegreeProgramListInputComponent;
  let fixture: ComponentFixture<DegreeProgramListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeProgramListInputComponent],
      imports: [
        FormsModule
      ],
      providers: []
    });
    fixture = TestBed.createComponent(DegreeProgramListInputComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      majors: new FormArray([]),
      minors: new FormArray([])
    });
    component.formGroup = form;
    component.formArray = form.get(
      'majors'
    ) as unknown as FormArray<FormControl>;
    component.formArrayName = 'majors';
    component.label = 'Majors';
    component.defaultValue = { name: '', operation: 'Create', isMinor: false };
    component.formArray = new FormArray<FormControl<DegreeProgramOperation | null>>([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add input', () => {
    const initialLength = component.formArray.length;

    component.addInput();

    expect(component.formArray.length).toBe(initialLength + 1);
  });

  it('should set value correctly when creating', () => {
    const control = new FormControl<DegreeProgramOperation>({
      name: '',
      operation: 'Create',
      isMinor: false,
    }, {
      nonNullable: true,
    });
    const event = {
      target: { value: 'Computer Science' },
    } as unknown as Event;

    component.setValue(control, event);

    expect(control.value.name).toBe('Computer Science');
    expect(control.value.operation).toBe('Create');
  });

  it('should set value correctly when editing', () => {
    const control = new FormControl<DegreeProgramOperation>({
      id: '1',
      name: '',
      operation: 'Create',
      isMinor: false,
    }, {
      nonNullable: true,
    });
    const event = {
      target: { value: 'Computer Science' },
    } as unknown as Event;

    component.setValue(control, event);

    expect(control.value.name).toBe('Computer Science');
    expect(control.value.operation).toBe('Edit');
  });

  it('should delete new control', () => {
    const control = new FormControl<DegreeProgramOperation>({
      name: '',
      operation: 'Create',
      isMinor: false,
    }, {
      nonNullable: true,
    });
    component.formArray.push(control);
    const index = component.formArray.length - 1;

    component.delete(control, index);

    expect(component.deleted.has(index)).toBe(true);
    expect(control.value.operation).toBe('Create');
  });

  it('should delete existing control', () => {
    const control = new FormControl<DegreeProgramOperation>({
      id: '1',
      name: 'Computer Science',
      operation: 'Edit',
      isMinor: false,
    }, {
      nonNullable: true,
    });
    component.formArray.push(control);
    const index = component.formArray.length - 1;

    component.delete(control, index);

    expect(component.deleted.has(index)).toBe(true);
    expect(control.value.operation).toBe('Delete');
  });
});
