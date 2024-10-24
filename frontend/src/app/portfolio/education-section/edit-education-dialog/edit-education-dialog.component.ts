import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  type FormArray,
  type FormGroup,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DegreeProgramOperation, PortfolioService } from '../../portfolio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/security/auth.service';
import { UserService } from 'src/app/security/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap, zipWith, map } from 'rxjs';
import { LangUtils } from 'src/app/util/lang-utils';
import { User } from 'src/app/security/domain/user';
import Education from 'src/domain/Education';

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
  protected title = 'Education';
  protected readonly yearLevels = [
    null,
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
  ];
  @Input() defaultValues?: EditEducationFormValues;
  private user: User = User.makeEmpty();
  isSubmitting: boolean = false;

  public constructor(
    private readonly dialogRef: MatDialogRef<EditEducationDialogComponent>,
    private readonly portfolioService: PortfolioService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

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
        this.universityIdValidator(),
      ],
      year: [this.defaultValues?.year ?? null],
      gpa: [this.defaultValues?.gpa ?? '', this.gpaValidator()],
      majors: this.formBuilder.array<FormControl>(
        this.defaultValues?.majors.map((major) =>
          this.formBuilder.control(major)
        ) ?? []
      ),
      minors: this.formBuilder.array<FormControl>(
        this.defaultValues?.minors.map((minor) =>
          this.formBuilder.control(minor)
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
        return { notInteger: true };
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
      if (!regex.test(value)) {
        return { invalidNumber: true };
      }
      return null;
    };
  }

  saveChanges(): void {
    if (this.form.invalid) {
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  get majors(): FormArray<FormControl> {
    return this.form?.controls['majors'] as FormArray<FormControl>;
  }

  get minors(): FormArray<FormControl> {
    return this.form?.controls['minors'] as FormArray<FormControl>;
  }
}
