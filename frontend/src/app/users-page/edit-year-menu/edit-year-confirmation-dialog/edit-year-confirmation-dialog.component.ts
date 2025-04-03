import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../security/user.service";
import {User} from "../../../security/domain/user";
import {YearLevel} from "../../../../domain/Milestone";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-year-confirmation-dialog',
  templateUrl: './edit-year-confirmation-dialog.component.html',
  styleUrls: ['./edit-year-confirmation-dialog.component.less']
})
export class EditYearConfirmationDialogComponent {
  protected readonly targetStudent: User;
  protected readonly year: YearLevel;

  constructor(
    private readonly userService: UserService,
    private readonly dialogRef: MatDialogRef<EditYearConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: EditYearConfirmationDialogData,
    private readonly snackBar: MatSnackBar
  ) {
    this.targetStudent = data.targetStudent;
    this.year = data.year;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    this.userService.adminEditYear(this.targetStudent, this.year)
      .subscribe((studentDetails) => {
        this.targetStudent.studentDetails = studentDetails ?? undefined;
        this.snackBar.open("Year updated successfully.", 'close', {
          duration: 5_000,
        });
        this.dialogRef.close();
      });
  }

  formatYear(): string {
    if (this.year === YearLevel.SeniorPlus) {
      return 'Senior+';
    }
    return this.year.toString();
  }
}

export type EditYearConfirmationDialogData = {
  targetStudent: User,
  year: YearLevel
};
