import {Component, Input} from '@angular/core';
import {Role, User} from "../../security/domain/user";
import {YearLevel} from "../../../domain/Milestone";
import {MatDialog} from "@angular/material/dialog";
import {map, Observable} from "rxjs";
import {AuthService} from "../../security/auth.service";
import {
  EditYearConfirmationDialogComponent,
  EditYearConfirmationDialogData
} from "./edit-year-confirmation-dialog/edit-year-confirmation-dialog.component";

@Component({
  selector: 'edit-year-menu',
  templateUrl: './edit-year-menu.component.html',
  styleUrls: ['./edit-year-menu.component.less']
})
export class EditYearMenuComponent {
  @Input() targetStudent!: User;
  protected readonly YearLevel = YearLevel;

  constructor(private readonly dialog: MatDialog, private readonly authService: AuthService) {
  }

  public get years(): YearLevel[] {
    return Object.values(YearLevel)
      .filter(year => typeof year === 'string') as YearLevel[];
  }

  canBeChanged(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((curr) => {
        if (this.targetStudent.role !== Role.Student) {
          return false;
        }

        if (this.targetStudent.email === curr?.email) {
          return false;
        }

        return curr?.hasAdminPrivileges() ?? false;
      })
    );
  }

  onSelection(yearLevel: YearLevel) {
    const dialogData: EditYearConfirmationDialogData = {
      targetStudent: this.targetStudent,
      year: yearLevel,
    }
    this.dialog.open(EditYearConfirmationDialogComponent, {
      data: dialogData,
    });
  }
}
