import { Component, OnInit } from '@angular/core';
import { Location} from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, mergeMap, Observable, tap, zipWith} from 'rxjs';
import { Job } from 'src/domain/Job';
import { ArtifactService } from "../file-upload/artifact.service";
import { MilestoneService } from "../milestones-page/milestones/milestone.service";
import { AuthService } from '../security/auth.service';
import {Role, User} from '../security/domain/user';
import { UserService } from '../security/user.service';
import { Project } from 'src/domain/Project'
import {AddProjectModalComponent} from "./add-project-modal/add-project-modal.component";
import { SaveProjectRequest, ProjectService } from './project/project.service';
import { LangUtils } from '../util/lang-utils';
import { EditPersonalInfoDialogComponent } from './edit-personal-info-dialog/edit-personal-info-dialog.component';
import { ScreenSizeService } from '../util/screen-size.service';
import {
 InterestOperation,
  PortfolioService,
  SkillsOperation
} from "./portfolio.service";
import {
  EditSkillsDialogComponent
} from "./skills-section/edit-skills-dialog/edit-skills-dialog.component";
import {Skill} from "../../domain/Skill";
import {StudentDetails} from "../../domain/StudentDetails";
import {JobService} from "./job/job.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SaveJobDialogComponent} from "./save-job-dialog/save-job-dialog.component";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from "../common/confirmation-dialog/confirmation-dialog.component";
import {EditInterestsComponent} from "./edit-interests/edit-interests.component";
import {Interest} from "../../domain/Interest";
import {Club} from "../../domain/Club";
import {SaveClubDialogComponent} from "./save-club-dialog/save-club-dialog.component";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less', './personal-info.component.less', './job/jobs.less']
})
export class PortfolioComponent implements OnInit {
  user: User = User.makeEmpty();
  external: boolean = false;
  profileURL: string | null = null;
  completedMilestones: string[] = [];
  isMobile$: Observable<boolean>;
  personalSectionResize$: Observable<boolean>;
  private authenticatedUser$: Observable<User | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jobService: JobService,
    private readonly artifactService: ArtifactService,
    private readonly projectService: ProjectService,
    private readonly screenSizeSvc: ScreenSizeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly milestoneService: MilestoneService,

    private readonly addProjectDialogue : MatDialog,
    private readonly saveClubDialog: MatDialog,
    private readonly editPersonalInfoDialog: MatDialog,
    private readonly saveJobDialog: MatDialog,
    private readonly deleteDialog: MatDialog,
    private readonly editInterestDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private location: Location,
    private readonly portfolioService: PortfolioService,
    private readonly editDialog: MatDialog,
  ) {
    this.isMobile$ = screenSizeSvc.isMobile$;
    this.authenticatedUser$ = this.authService.user$;

    // Add the mobile styling to personal section because it gets squished around 1200.
    // At 1000 resume is moved downward and there is more space so go back to normal
    // styling until regular mobile kicks in.
    this.personalSectionResize$ = screenSizeSvc.screenSize$.pipe(
      map((it) => it < 1200 && it > 1000)
    );
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
      )
      .subscribe((user) => {
        if (LangUtils.exists(user)) {
          console.log("Updating user")
          this.user = user!;
          this.loadProfilePicture();
          this.milestoneService
            .getCompletedMilestones(user!.id)
            .subscribe((milestones) => {
              this.completedMilestones = milestones.map((it) => it.name);
            });
        }
      });
  }

  goBack() {
    this.location.back()
  }


  loadProfilePicture() {
    this.artifactService.getArtifactFile(this.user.profilePictureId)
      .subscribe((blob) => {
        this.user.profilePictureURL = URL.createObjectURL(blob);
      });
  }


  getSkills(isLanguages: boolean): SkillsOperation[] {
      return (
        this.user.studentDetails?.skills
          .filter(skill => skill.isLanguage==isLanguages)
            .map((skill) => ({
              id: skill.id,
              operation: 'Edit',
              name: skill.name,
              isLanguage: skill.isLanguage
            }))?? []
      )
  }

  getInterests(): InterestOperation[]{
    return (
      this.user.studentDetails?.interests
        .map((interest) => ({
            id: interest.id,
            operation: 'Edit',
            name: interest.name
        }))?? []
    )
  }

  openEditInterests() : void {
    const dialogRef = this.editInterestDialog.open(EditInterestsComponent);
    dialogRef.componentInstance.defaultValues = {
      interests: this.getInterests(),
    };

    dialogRef.afterClosed().subscribe((form: Interest[]) => {
      this.portfolioService.saveInterest(form).subscribe(
        updatedStudentDetails => {
          this.user.studentDetails = updatedStudentDetails;
        }
      )
    })

  }

  openEditDialog(isLanguages: boolean): void {
    const dialogRef = this.editDialog.open(EditSkillsDialogComponent);
    dialogRef.componentInstance.defaultValues = {
      skills: this.getSkills(isLanguages),
    };
    dialogRef.componentInstance.isLanguageParent = isLanguages;

    dialogRef.afterClosed().subscribe((result?: Skill[]) => {
      if (!result) return;
      const oldSkills =  this.user.studentDetails
        ? this.user.studentDetails.skills
        : new Array<Skill>()
      const oldSkillsOnlyLanguages = oldSkills.filter((skill) => {
          return skill.isLanguage
      })
      const oldSkillsOnlySkills = oldSkills.filter((skill) => {
        return !skill.isLanguage
      })

      let newSkills;
      if(isLanguages) {
        newSkills = [...oldSkillsOnlySkills, ...result]
      } else {
        newSkills = [...oldSkillsOnlyLanguages, ...result]
      }

      this.portfolioService.saveSkills(newSkills)
        .subscribe(
          updatedStudentDetails => {
            this.user.studentDetails = updatedStudentDetails;
          }
        )
    });
  }

  goToLinkedIn() {
    location.href = this.user.linkedin;
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
  openEditPersonalInfoDialog() {
    const dialogRef = this.editPersonalInfoDialog.open(EditPersonalInfoDialogComponent);
    dialogRef.afterClosed().subscribe((personalInfo) => {
      if (!personalInfo) {
        return;
      }
      this.user.setPersonalInfo(personalInfo);
    });
  }

  skills(): string[] {
    return (this.user.studentDetails?.skills ?? [])
      .filter((s) => !s.isLanguage)
      .map((s) => s.name);
  }

  jobs(): Job[] {
    return (this.user.studentDetails?.jobs ?? [])
      .filter((s) => !s.isCoop)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }



  editClub(club: Club): void {
    const dialogRef = this.saveClubDialog.open(SaveClubDialogComponent,  {
      data: club
    });
    dialogRef.afterClosed().subscribe((club?: Club)=> {
      if (!club) return;
      this.portfolioService.saveClub(club).subscribe(club => {
          if (!this.user.studentDetails) {
            this.user.studentDetails = StudentDetails.makeEmpty();
          }
          this.user.studentDetails.clubs = this.user.studentDetails.clubs.map(c => c.id === club.id ? club: c);
        }
      )
    })


  }
  createClub(): void {
    const dialogRef = this.saveClubDialog.open(SaveClubDialogComponent);
    dialogRef.afterClosed().subscribe((club?: Club)=> {
      if (!club) return;
      this.portfolioService.saveClub(club).subscribe(club =>
        this.user.studentDetails?.clubs.push(club)
      )

    })
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

  deleteClub(club: Club) {
    const dialogData: ConfirmationDialogData = {
      entityId: club.id,
      title: 'Delete Club?',
      action: `delete the club ${club.name}`,
      onConfirm: () => this.confirmDeleteClub(club)
    }
    this.saveClubDialog.open(ConfirmationDialogComponent, {
      data: dialogData
    })
  }


  confirmDeleteClub(club: Club) {
    const alertDurationMs = 5000;
    this.portfolioService.deleteClub(club.id)
      .subscribe({
        next: () => {
          if (!this.user.studentDetails) {
            this.user.studentDetails = StudentDetails.makeEmpty();
          }
          this.user.studentDetails.clubs = this.user.studentDetails?.clubs.filter((j) => j.id !== club.id);
          this.deleteDialog.closeAll();
          this.snackBar.open('Club deleted successfully.', 'Close', {
            duration: alertDurationMs,
          });
        },
        error: (error: unknown) => {
          console.error(error);
          this.snackBar.open('Failed to delete club.', 'Close', {
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


  formatDate(date: Date | null){
    if(!date){
      return 'Ongoing'
    }
    return this.isMobile$ ? date.toLocaleString("en-US", {month: "numeric", year: "numeric", day: "numeric"}) :
      date.toLocaleString("en-US", {month: "long", year: "numeric", day: "numeric"});

  }

  openAddProjectModal() {
    const dialogRef = this.addProjectDialogue.open(AddProjectModalComponent,{
        width: '500px',
        data: { header: "Add New Project"}
      });
    dialogRef.afterClosed().subscribe((result: SaveProjectRequest) => {
      if (!result) {
        return;
      }
      this.projectService.saveProject(result).subscribe((project) => {
        this.user.studentDetails?.projects?.push(project);
      });
    });
  }
  openEditProjectModal(project: Project): void {
    const dialogRef = this.addProjectDialogue.open(AddProjectModalComponent, {
      width: '500px',
      data: {
        header: "Edit Project",
        Project: project
      }
    });
    dialogRef.afterClosed().subscribe((result?: SaveProjectRequest) => {
      if (!result) {
        return;
      }
      if (!this.user.studentDetails) {
        this.user.studentDetails = StudentDetails.makeEmpty();
      }
      const updatedProject: Project = {
        ...result,
        id: project.id,
        studentDetailsID: this.user.studentDetails.id,
      };

      this.user.studentDetails.projects = this.user.studentDetails.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      );


      this.projectService.saveProject(updatedProject).subscribe(
        (project) => {
        },
        (error) => {
          alert('Failed to save project: ' + error.message);
        }
      );
    });
  }

  confirmProjectDelete(project: Project) {
    const alertDurationMs = 5000;
    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        if (!this.user.studentDetails) {
          this.user.studentDetails = StudentDetails.makeEmpty();
        }
        this.user.studentDetails.projects = this.user.studentDetails?.projects.filter((p) => p.id !== project.id);
        this.deleteDialog.closeAll();
        this.snackBar.open('Project deleted successfully.', 'Close', {
          duration: alertDurationMs,
        });
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('Failed to delete Project.', 'Close', {
          duration: alertDurationMs,
        });
      }
    });
  }
  deleteProject(project: Project){
    const dialogueRef: ConfirmationDialogData = {
      entityId : project.id,
      title: 'Delete this Project?',
      action: `delete the project "${project.name}"?`,
      onConfirm: () => this.confirmProjectDelete(project)
    };
    this.addProjectDialogue.open(ConfirmationDialogComponent, {
      data: dialogueRef
    })
  }

  currentUserMatchesPortfolioUser(): Observable<boolean> {
    return this.authenticatedUser$
      .pipe(
        map((authenticatedUser) => this.user.id === authenticatedUser?.id)
      );
  }

  protected readonly Role = Role;
}
