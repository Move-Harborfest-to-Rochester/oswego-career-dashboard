import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, mergeMap, Observable, zipWith } from 'rxjs';
import { AuthService } from 'src/app/security/auth.service';
import { User } from 'src/app/security/domain/user';
import { UserService } from 'src/app/security/user.service';
import { LangUtils } from 'src/app/util/lang-utils';
import { ScreenSizeService } from 'src/app/util/screen-size.service';
import {
  DegreeProgramOperation,
} from '../portfolio.service';
import {
  EditEducationDialogComponent,
} from './edit-education-dialog/edit-education-dialog.component';

@Component({
  selector: 'education-section',
  templateUrl: './education-section.component.html',
  styleUrls: ['./education-section.component.less'],
})
export class EducationSectionComponent implements OnInit {
  user: User = User.makeEmpty();
  isMobile$: Observable<boolean>;
  external: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly screenSizeSvc: ScreenSizeService,
    private readonly route: ActivatedRoute,
    private readonly editDialog: MatDialog,
  ) {
    this.isMobile$ = screenSizeSvc.isMobile$;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        mergeMap((map: ParamMap) => {
          if (map.has('id')) {
            this.external = true;
            return this.userService.getUser(map.get('id')!);
          } else {
            return this.authService.user$;
          }
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

  openEditDialog(): void {
    const dialogRef = this.editDialog.open(EditEducationDialogComponent);
    dialogRef.addPanelClass('edit-dialog');
    dialogRef.componentInstance.defaultValues = {
      universityId: this.user.studentDetails?.universityId ?? '',
      year: this.user.studentDetails?.yearLevel ?? '',
      gpa: String(this.user.studentDetails?.gpa ?? ''),
      majors: this.getMajorsFromUser() ?? [],
      minors: this.getMinorsFromUser() ?? [],
    };
  }

  getMajorsFromUser(): DegreeProgramOperation[] {
    return (
      this.user.studentDetails?.degreePrograms
        .filter((d) => !d.isMinor)
        .map((value) => ({
          id: value.id,
          operation: 'Edit',
          name: value.name,
          isMinor: false,
        })) ?? []
    );
  }

  getMinorsFromUser(): DegreeProgramOperation[] {
    return (
      this.user.studentDetails?.degreePrograms
        .filter((d) => d.isMinor)
        .map((value) => ({
          id: value.id,
          operation: 'Edit',
          name: value.name,
          isMinor: true,
        })) ?? []
    );
  }

  majors(): string[] {
    return (this.user.studentDetails?.degreePrograms ?? [])
      .filter((d) => !d.isMinor)
      .map((d) => d.name);
  }

  minors(): string[] {
    return (this.user.studentDetails?.degreePrograms ?? [])
      .filter((d) => d.isMinor)
      .map((d) => d.name);
  }


  disableEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
