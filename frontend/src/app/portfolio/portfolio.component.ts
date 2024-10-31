import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, mergeMap, Observable, tap, zipWith } from 'rxjs';
import { Job } from 'src/domain/Job';
import { ArtifactService } from "../file-upload/artifact.service";
import { MilestoneService } from "../milestones-page/milestones/milestone.service";
import { AuthService } from '../security/auth.service';
import { User } from '../security/domain/user';
import { UserService } from '../security/user.service';
import { LangUtils } from '../util/lang-utils';
import { ScreenSizeService } from "../util/screen-size.service";
import { SaveJobDialogComponent } from './save-job-dialog/save-job-dialog.component';
import { JobService } from './job/job.service';
import { StudentDetails } from 'src/domain/StudentDetails';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../common/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPersonalInfoDialogComponent } from './edit-personal-info-dialog/edit-personal-info-dialog.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit {
  user: User = User.makeEmpty();
  external: boolean = false;
  profileURL: string | null = null;
  completedMilestones: string[] = [];
  isMobile$: Observable<boolean>;
  personalSectionResize$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly artifactService: ArtifactService,
    private readonly screenSizeSvc: ScreenSizeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly milestoneService: MilestoneService,
    private readonly editPersonalInfoDialog: MatDialog,
    private readonly saveJobDialog: MatDialog,
    private readonly deleteDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {
    this.isMobile$ = screenSizeSvc.isMobile$;

    // Add the mobile styling to personal section because it gets squished around 1200.
    // At 1000 resume is moved downward and there is more space so go back to normal
    // styling until regular mobile kicks in.
    this.personalSectionResize$ = screenSizeSvc.screenSize$.pipe(map(it => it < 1200 && it > 1000));
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((map: ParamMap) => {
        if (map.has('id')) {
          this.external = true;
          return this.userService.getUser(map.get('id')!);
        } else {
          return this.authService.user$;
        }
      }),
      zipWith(this.route.url),
      tap(([_, url]) => {
        let hasFaculty = false;
        url.forEach((segment) => {
          if (segment.path === 'faculty') {
            hasFaculty = true;
          }
        });
        if (!this.external && hasFaculty) this.router.navigate(['']);
      }),
      map(([user, _]) => user)
    ).subscribe((user) => {
      if (LangUtils.exists(user)) {
        this.user = user!;
        this.loadProfilePicture();
        this.milestoneService.getCompletedMilestones(user!.id).subscribe((milestones) => {
          this.completedMilestones = milestones.map((it) => it.name)
        })
      }
    });
  }

  loadProfilePicture() {
    this.artifactService.getArtifactFile(this.user.profilePictureId)
      .subscribe((blob) => {
        this.user.profilePictureURL = URL.createObjectURL(blob);
      });
  }

  goToLinkedIn() {
    location.href = this.user.linkedin;
  }

  openEditPersonalInfoDialog() {
    const dialogRef = this.editPersonalInfoDialog.open(EditPersonalInfoDialogComponent);
    dialogRef.afterClosed().subscribe((personalInfo) => {
      if (!personalInfo) {
        return;
      }
      this.user.setPersonalInfo(personalInfo);
    });
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

  skills(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => !s.isLanguage)
      .map((s) => s.name);
  }

  jobs(): Job[] {
    return (this.user.studentDetails?.jobs ?? [])
      .filter((s) => !s.isCoop)
  }

  createJob(): void {
    const dialogRef = this.saveJobDialog.open(SaveJobDialogComponent);
    dialogRef.afterClosed().subscribe((job?: Job) => {
      if (!job) {
        return;
      }
      this.user.studentDetails?.jobs?.push(job);
    });
  }

  editJob(job: Job): void {
    const dialogRef = this.saveJobDialog.open(SaveJobDialogComponent, {
      data: job,
    });
    dialogRef.afterClosed().subscribe((job?: Job) => {
      if (!job) {
        return;
      }
      if (!this.user.studentDetails) {
        this.user.studentDetails = StudentDetails.makeEmpty();
      }
      this.user.studentDetails.jobs = this.user.studentDetails.jobs.map((j) => j.id === job.id ? job : j);
    });
  }

  confirmDelete(job: Job) {
    const alertDurationMs = 5000;
    this.jobService.deleteJob(job.id).subscribe({
      next: () => {
        if (!this.user.studentDetails) {
          this.user.studentDetails = StudentDetails.makeEmpty();
        }
        this.user.studentDetails.jobs = this.user.studentDetails?.jobs.filter((j) => j.id !== job.id);
        this.deleteDialog.closeAll();
        this.snackBar.open('Job deleted successfully.', 'Close', {
          duration: alertDurationMs,
        });
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('Failed to delete job.', 'Close', {
          duration: alertDurationMs,
        });
      }
    });
  }

  deleteJob(job: Job) {
    const dialogData: ConfirmationDialogData = {
      entityId: job.id,
      title: 'Delete Job?',
      action: `delete the job "${job.name}" at "${job.location}"`,
      onConfirm: () => this.confirmDelete(job)
    };
    this.saveJobDialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
  }


  coops(): Job[] {
    return (this.user.studentDetails?.jobs ?? [])
      .filter((s) => s.isCoop)
  }

  languages(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => s.isLanguage)
      .map((s) => s.name);
  }

  dateHeader(header: string): string {
    return this.isMobile$ ? `${header}:` : `${header} Date:`;
  }

  formatDate(date: Date) {
    return this.isMobile$ ? date.toLocaleString("en-US", { month: "numeric", year: "numeric", day: "numeric" }) :
      date.toLocaleString("en-US", { month: "long", year: "numeric", day: "numeric" });
  }
}
