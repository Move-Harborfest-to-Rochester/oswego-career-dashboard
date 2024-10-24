import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../portfolio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import PersonalInfo from 'src/domain/PersonalInfo';
import { AuthService } from 'src/app/security/auth.service';
import { map, zip } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/security/domain/user';

export interface EditPersonalInfoRequest {
  firstName: string;
  preferredName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedIn: string;
  description: string;
}

@Component({
  selector: 'app-edit-personal-info-dialog',
  templateUrl: './edit-personal-info-dialog.component.html',
  styleUrls: ['./edit-personal-info-dialog.component.less', '../../../common.less']
})
export class EditPersonalInfoDialogComponent {
  readonly title: string = 'Edit Profile';
  isSubmitting: boolean = false;
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly portfolioService: PortfolioService,
    private readonly authService: AuthService,
    private readonly dialogRef: MatDialogRef<EditPersonalInfoDialogComponent>
  ) {
  }

  ngOnInit() {
    this.dialogRef.addPanelClass('edit-dialog');

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      preferredName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      linkedIn: [''],
      description: ['']
    });

    this.authService.user$
      .pipe(
        map(user => user?.getPersonalInfo())
      )
      .subscribe((personalInfo?: PersonalInfo) => {
        if (!personalInfo) {
          return;
        }
        this.form.reset({
          firstName: personalInfo.firstName,
          preferredName: personalInfo.preferredName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phoneNumber: personalInfo.phoneNumber,
          linkedIn: personalInfo.linkedIn,
          description: personalInfo.description
        });
      });
  }

  closeDialog(personalInfo?: PersonalInfo) {
    this.dialogRef.close(personalInfo);
  }

  refreshPersonalInfo(personalInfo: PersonalInfo) {
    this.authService.user$
      .pipe(
        map(user => user?.setPersonalInfo(personalInfo))
      )
  }

  saveChanges() {
    const alertDurationMs = 5000;
    this.isSubmitting = true;
    this.dialogRef.disableClose = true;
    this.portfolioService.editPersonalInfo(this.form.value).subscribe({
      next: (personalInfo: PersonalInfo) => {
        this.closeDialog(personalInfo);
        this.refreshPersonalInfo(personalInfo);
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: alertDurationMs
        });
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: alertDurationMs
        });
      },
      complete: () => {
        this.isSubmitting = false;
        this.dialogRef.disableClose = false;
      }
    });
  }
}
