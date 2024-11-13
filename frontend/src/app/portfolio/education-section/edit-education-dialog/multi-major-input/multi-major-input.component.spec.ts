import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArray, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { DegreeProgramOperation } from 'src/app/portfolio/portfolio.service';
import { MultiMajorInputComponent } from './multi-major-input.component';

describe('ListInputComponent', () => {
  let component: MultiMajorInputComponent;
  let fixture: ComponentFixture<MultiMajorInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiMajorInputComponent],
      imports: [
        FormsModule
      ],
      providers: []
    });
    fixture = TestBed.createComponent(MultiMajorInputComponent);
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

    expect(component.formArray.controls).not.toContain(control);
    expect(component.deleted.has(index)).toBe(false);
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

    expect(component.formArray.controls).toHaveSize(1);
    expect(component.formArray.controls[0].value?.id).toBe('1');
    expect(component.deleted.has(index)).toBe(true);
    expect(control.value.operation).toBe('Delete');
  });
});
