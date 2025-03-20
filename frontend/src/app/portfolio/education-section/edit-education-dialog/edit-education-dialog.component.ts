import {Component, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  type FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {DegreeProgramOperation, PortfolioService} from '../../portfolio.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from 'src/app/security/auth.service';
import {UserService} from 'src/app/security/user.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map, mergeMap, zipWith} from 'rxjs';
import {LangUtils} from 'src/app/util/lang-utils';
import {User} from 'src/app/security/domain/user';
import Education from 'src/domain/Education';
import {DegreeProgramOperationGroup} from './multi-major-input/multi-major-input.component';

export type EditEducationFormValues = {
  universityId: string;
  year: string;
  gpa: string;
  majors: DegreeProgramOperation[];
  minors: DegreeProgramOperation[];
};

@Component({
  selector: 'app-edit-education-dialog',
  templateUrl: './edit-education-dialog.component.html',
  styleUrls: [
    './edit-education-dialog.component.less',
    '../../portfolio.component.less',
    '../education-section.component.less',
    '../../../../common.less',
  ],
})
export class EditEducationDialogComponent implements OnInit {
  form!: FormGroup;
  @Input() defaultValues?: EditEducationFormValues;
  isSubmitting: boolean = false;
  protected title = 'Education';
  protected readonly yearLevels = [
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
  ];
  private user: User = User.makeEmpty();

  public constructor(
    private readonly dialogRef: MatDialogRef<EditEducationDialogComponent>,
    private readonly portfolioService: PortfolioService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }

  get majors(): FormArray<DegreeProgramOperationGroup> {
    return this.form?.controls['majors'] as FormArray<DegreeProgramOperationGroup>;
  }

  get minors(): FormArray<FormControl> {
    return this.form?.controls['minors'] as FormArray<FormControl>;
  }

  get majorNameValidators(): ValidatorFn[] {
    return [Validators.required, this.majorNameValidator()];
  }

  ngOnInit() {
    this.createForm();
    this.dialogRef.addPanelClass('edit-dialog');

    this.route.paramMap
      .pipe(
        mergeMap((map: ParamMap) => {
          return map.has('id')
            ? this.userService.getUser(map.get('id')!)
            : this.authService.user$;
        }),
        zipWith(this.route.url),
        map(([user, _]) => user)
      )
      .subscribe((user) => {
        if (LangUtils.exists(user)) {
          this.user = user!;
        }
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      universityId: [
        this.defaultValues?.universityId ?? '',
        [this.universityIdValidator(),]
      ],
      year: [this.defaultValues?.year ?? null],
      gpa: [this.defaultValues?.gpa ?? '', [this.gpaValidator()]],
      majors: this.formBuilder.array<DegreeProgramOperationGroup>(
        this.defaultValues?.majors.map((major) =>
          this.formBuilder.group({
            id: this.formBuilder.control(major.id ?? null),
            operation: this.formBuilder.control(major.operation, this.operationValidators()),
            name: this.formBuilder.control(major.name, this.majorNameValidators),
            isMinor: this.formBuilder.control(false),
          })
        ) ?? []
      ),
      minors: this.formBuilder.array<FormControl>(
        this.defaultValues?.minors.map((minor) =>
          this.formBuilder.control(minor, [Validators.required])
        ) ?? []
      ),
    });
  }

  universityIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const regex = new RegExp(/^\d+$/);
      if (!regex.test(value)) {
        return {notInteger: true};
      }
      return null;
    };
  }

  gpaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!regex.test(value) || value > 4.0) {
        return {invalidNumber: true};
      }
      return null;
    };
  }

  majorNameValidator(): ValidatorFn {
    return (majorNameControl: AbstractControl<string>): ValidationErrors | null => {
      const majorFormGroup = (majorNameControl.parent as DegreeProgramOperationGroup | null);
      if (isValidDeleteOperation(majorNameControl.value)) {
        return null;
      }

      let majorName = majorNameControl.value;
      if (typeof majorName !== "string") { //the tests won't pass without this check
        majorName = "";
      }
      majorName = majorName.trim();
      if (this.majorIsDuplicate(majorName, majorFormGroup)) {
        return {duplicateMajor: true};
      }
      if (!majorName ! || majorName === '') {
        return {invalidMajor: true};
      }
      return null;
    };
  }

  saveChanges(): void {
    if (this.form.invalid) {
      console.warn('Form is invalid:', this.form);
      return;
    }
    const alertDurationMs = 5000;
    this.isSubmitting = true;
    this.dialogRef.disableClose = true;
    this.portfolioService.editEducation(this.form.value).subscribe({
      next: (education: Education) => {
        this.isSubmitting = false;
        this.dialogRef.disableClose = false;
        this.dialogRef.close();
        this.user.setEducation(education);
        this.snackBar.open('Education saved successfully.', 'Close', {
          duration: alertDurationMs,
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.dialogRef.disableClose = false;
        console.error('Error saving education:', error);
        this.snackBar.open('Education failed to save.', 'Close', {
          duration: alertDurationMs,
        });
      },
    });
  }

  getDefaultDegreeProgramOperation(isMinor: boolean): DegreeProgramOperation {
    return {
      operation: 'Create',
      name: '',
      isMinor,
    };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  operationValidators(): ValidatorFn[] {
    return [Validators.required];
  }

  /**
   * Will determine if the student can save the education
   */
  canSubmit(): boolean {
    return false;
  }

  private majorIsDuplicate(majorName: string, majorFormGroup: DegreeProgramOperationGroup | null) {
    if (!majorFormGroup) {
      return false;
    }
    let count = 0;
    (this.form.get('majors') as FormArray<DegreeProgramOperationGroup>).controls.forEach((control) => {
      if (control.get('name')?.value === majorName) {
        count++;
      }
    })
    return count > 1;
  }
}

function isValidDeleteOperation(majorName: string): boolean {
  if (!majorName) {
    return false;
  }
  return majorName === 'deleted';
}
