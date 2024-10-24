import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalInfoDialogComponent } from './edit-personal-info-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/security/auth.service';
import { PortfolioService } from '../portfolio.service';
import { of } from 'rxjs';
import { User } from 'src/app/security/domain/user';
import { userJSON } from 'src/app/security/auth.service.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import PersonalInfo from '../../../domain/PersonalInfo';

describe('EditPersonalInfoDialogComponent', () => {
  let component: EditPersonalInfoDialogComponent;
  let fixture: ComponentFixture<EditPersonalInfoDialogComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<EditPersonalInfoDialogComponent>>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let user: User;

  beforeEach(() => {
    user = new User(userJSON);
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'addPanelClass']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [''], {user$: of(user)});

    TestBed.configureTestingModule({
      declarations: [EditPersonalInfoDialogComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: PortfolioService, useValue: {} },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(EditPersonalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh personal info', () => {
    const personalInfo: PersonalInfo = new PersonalInfo({
      ...user.getPersonalInfo(),
      firstName: 'John',
    });

    component.refreshPersonalInfo(personalInfo).subscribe(() => {
      expect(user.getPersonalInfo()).toEqual(personalInfo);
    });
  })
});
