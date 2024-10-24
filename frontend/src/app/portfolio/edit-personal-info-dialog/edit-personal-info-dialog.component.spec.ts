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

describe('EditPersonalInfoDialogComponent', () => {
  let component: EditPersonalInfoDialogComponent;
  let fixture: ComponentFixture<EditPersonalInfoDialogComponent>;

  beforeEach(() => {
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
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: PortfolioService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ]
    });
    fixture = TestBed.createComponent(EditPersonalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
