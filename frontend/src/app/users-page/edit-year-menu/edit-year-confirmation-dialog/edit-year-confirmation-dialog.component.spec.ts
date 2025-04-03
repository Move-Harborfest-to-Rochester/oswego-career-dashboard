import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  EditYearConfirmationDialogComponent
} from './edit-year-confirmation-dialog.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import {UserService} from "../../../security/user.service";
import {userJSON} from "../../../security/auth.service.spec";
import {User} from "../../../security/domain/user";
import {YearLevel} from "../../../../domain/Milestone";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('EditYearConfirmationDialogComponent', () => {
  let component: EditYearConfirmationDialogComponent;
  let fixture: ComponentFixture<EditYearConfirmationDialogComponent>;
  const userServiceMock = jasmine.createSpyObj('UserService', ['adminEditYear']);
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditYearConfirmationDialogComponent],
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule],
      providers: [
        {provide: UserService, useValue: userServiceMock},
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            targetStudent: new User(userJSON),
            year: YearLevel.Freshman
          }
        }
      ]
    });
    fixture = TestBed.createComponent(EditYearConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
