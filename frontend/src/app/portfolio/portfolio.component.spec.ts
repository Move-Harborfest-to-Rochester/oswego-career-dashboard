import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PortfolioComponent} from './portfolio.component';
import {MockComponent} from "ng-mocks";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import {MatCardModule} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { ArtifactService } from '../file-upload/artifact.service';

import {AuthService} from '../security/auth.service';
import {UserService} from '../security/user.service';
import {User} from '../security/domain/user';
import {ResumeComponent} from './resume/resume.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {EducationSectionModule} from './education-section/education-section.module';
// portfolio.component.spec.ts
import { ActivatedRoute, convertToParamMap, Router, UrlSegment } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ResumeModule} from "./resume/resume.module";
import {ProjectService} from "./project/project.service";
import {PortfolioService} from "./portfolio.service";
import {JobService} from "./job/job.service";
import {LangUtils} from "../util/lang-utils";

const userJSON = {
  id: 'user-1',
  firstName: 'Test',
  lastName: 'User',
  profilePictureId: 'pic-1',
  linkedin: 'https://linkedin.com/in/test'
};

// Stub for StudentDetails (and add a static makeEmpty method)
class DummyStudentDetails {
  id = 'student-1';
  skills: any[] = [];
  interests: any[] = [];
  jobs: any[] = [];
  clubs: any[] = [];
  projects: any[] = [];
  degreePrograms: any[] = [];
  static makeEmpty(): DummyStudentDetails {
    return new DummyStudentDetails();
  }
}

// A minimal dummy User class with a setPersonalInfo method.
class DummyUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureId: string;
  linkedin: string;
  studentDetails?: DummyStudentDetails;
  profilePictureURL?: string;
  setPersonalInfo = jasmine.createSpy('setPersonalInfo');

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.profilePictureId = data.profilePictureId;
    this.linkedin = data.linkedin;
  }

  static makeEmpty(): DummyUser {
    return new DummyUser({
      id: '',
      firstName: '',
      lastName: '',
      profilePictureId: '',
      linkedin: ''
    });
  }
}

describe('PortfolioComponent - Full Coverage', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  // Create spy objects for services.
  let authServiceSpy: jasmine.SpyObj<any>;
  let userServiceSpy: jasmine.SpyObj<any>;
  let jobServiceSpy: jasmine.SpyObj<any>;
  let artifactServiceSpy: jasmine.SpyObj<any>;
  let projectServiceSpy: jasmine.SpyObj<any>;
  let screenSizeSvcSpy: jasmine.SpyObj<any>;
  let milestoneServiceSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let portfolioServiceSpy: jasmine.SpyObj<any>;

  // Create separate MatDialog spies for the different dialogs.
  let addProjectDialogueSpy: jasmine.SpyObj<MatDialog>;
  let saveClubDialogSpy: jasmine.SpyObj<MatDialog>;
  let editPersonalInfoDialogSpy: jasmine.SpyObj<MatDialog>;
  let saveJobDialogSpy: jasmine.SpyObj<MatDialog>;
  let deleteDialogSpy: jasmine.SpyObj<MatDialog>;
  let editInterestDialogSpy: jasmine.SpyObj<MatDialog>;
  let editDialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  // Use a dummy ActivatedRoute.
  let routeSpy: any;

  // Create dummy user and studentDetails.
  let dummyStudentDetails: DummyStudentDetails;
  let dummyUser: DummyUser;

  // Helper to create a fake dialog ref.
  function fakeDialogRef<T>(result: T): MatDialogRef<any, any> {
    return ({
      componentInstance: {},
      afterClosed: () => of(result),
      close: () => {}
    } as unknown) as MatDialogRef<any, any>;
  }


  beforeEach(() => {
    // Create dummy studentDetails and user.
    dummyStudentDetails = DummyStudentDetails.makeEmpty();
    dummyUser = new DummyUser(userJSON);
    dummyUser.studentDetails = dummyStudentDetails;

    // Create spies for services.
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: of(dummyUser) });
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    jobServiceSpy = jasmine.createSpyObj('JobService', ['deleteJob']);
    artifactServiceSpy = jasmine.createSpyObj('ArtifactService', ['getArtifactFile']);
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['saveProject', 'deleteProject']);
    screenSizeSvcSpy = jasmine.createSpyObj('ScreenSizeService', [], { isMobile$: of(false), screenSize$: of(1024) });
    milestoneServiceSpy = jasmine.createSpyObj('MilestoneService', ['getCompletedMilestones']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    portfolioServiceSpy = jasmine.createSpyObj('PortfolioService', ['saveInterest', 'saveSkills', 'saveClub', 'deleteClub']);

    // Create separate MatDialog spies.
    addProjectDialogueSpy = jasmine.createSpyObj('MatDialog', ['open']);
    saveClubDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    editPersonalInfoDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    saveJobDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    deleteDialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    editInterestDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    editDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Default spy behaviors.
    userServiceSpy.getUser.and.returnValue(of(dummyUser));
    milestoneServiceSpy.getCompletedMilestones.and.returnValue(of([{ name: 'Milestone1' }, { name: 'Milestone2' }]));
    artifactServiceSpy.getArtifactFile.and.returnValue(of(new Blob(['dummy'], { type: 'image/png' })));
    portfolioServiceSpy.saveInterest.and.callFake((interests: any) => of({ ...dummyStudentDetails, interests }));
    portfolioServiceSpy.saveSkills.and.callFake((skills: any) => of({ ...dummyStudentDetails, skills }));
    portfolioServiceSpy.saveClub.and.callFake((club: any) => of(club));
    projectServiceSpy.saveProject.and.callFake((projectRequest: any) =>
      of({ ...projectRequest, id: 'project-1', studentDetailsID: dummyStudentDetails.id })
    );
    portfolioServiceSpy.deleteClub.and.returnValue(of({}));

    projectServiceSpy.deleteProject.and.returnValue(of({}));
    jobServiceSpy.deleteJob.and.returnValue(of({}));

    // Set up a default route (internal user with no external id).
    routeSpy = {
      paramMap: of(convertToParamMap({})),
      url: of([new UrlSegment('', {})])
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        PdfViewerModule,
        EducationSectionModule,
      ],
      declarations: [PortfolioComponent,
        MockComponent(ResumeComponent),
        MockComponent(MilestonesComponent)],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: JobService, useValue: jobServiceSpy },
        { provide: ArtifactService, useValue: artifactServiceSpy },  // <-- now using the class token

        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: 'ScreenSizeService', useValue: screenSizeSvcSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: 'MilestoneService', useValue: milestoneServiceSpy },
        // We provide one instance for MatDialog (it will be overwritten below)
        { provide: MatDialog, useValue: addProjectDialogueSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Location, useValue: locationSpy },
        { provide: PortfolioService, useValue: portfolioServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;

    // Reassign the different MatDialog properties on the component.
    (component as any).addProjectDialogue = addProjectDialogueSpy;
    (component as any).saveClubDialog = saveClubDialogSpy;
    (component as any).editPersonalInfoDialog = editPersonalInfoDialogSpy;
    (component as any).saveJobDialog = saveJobDialogSpy;
    (component as any).deleteDialog = deleteDialogSpy;
    (component as any).editInterestDialog = editInterestDialogSpy;
    (component as any).editDialog = editDialogSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back on goBack', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should load profile picture and update user.profilePictureURL', () => {
    const blob = new Blob(['dummy'], { type: 'image/png' });
    artifactServiceSpy.getArtifactFile.and.returnValue(of(blob));
    spyOn(URL, 'createObjectURL').and.returnValue('blob://dummy');
    component.loadProfilePicture();
    expect(artifactServiceSpy.getArtifactFile).toHaveBeenCalledWith(dummyUser.profilePictureId);
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(component.user.profilePictureURL).toBe('blob://dummy');
  });

  describe('getSkills', () => {
    it('should return empty array if studentDetails is undefined', () => {
      component.user.studentDetails = undefined;
      expect(component.getSkills(true)).toEqual([]);
    });

    it('should filter skills based on isLanguages', () => {
      const skills = [
        { id: 's1', name: 'Skill1', isLanguage: false },
        { id: 's2', name: 'Language1', isLanguage: true }
      ];
      component.user.studentDetails!.skills = skills;
      const languageSkills = component.getSkills(true);
      const nonLanguageSkills = component.getSkills(false);
      expect(languageSkills).toEqual([{ id: 's2', name: 'Language1', isLanguage: true, operation: 'Edit' }]);
      expect(nonLanguageSkills).toEqual([{ id: 's1', name: 'Skill1', isLanguage: false, operation: 'Edit' }]);
    });
  });

  describe('getInterests', () => {
    it('should return empty array if studentDetails is undefined', () => {
      component.user.studentDetails = undefined;
      expect(component.getInterests()).toEqual([]);
    });

    it('should map interests correctly', () => {
      const interests = [{ id: 'i1', name: 'Interest1' }];
      component.user.studentDetails!.interests = interests;
      expect(component.getInterests()).toEqual([{ id: 'i1', name: 'Interest1', operation: 'Edit' }]);
    });
  });

  describe('Dialog-based methods', () => {
    it('openEditInterests should update studentDetails interests when dialog returns a result', fakeAsync(() => {
      const interestsResult = [{ id: 'i2', name: 'Interest2' }];
      editInterestDialogSpy.open.and.returnValue(fakeDialogRef(interestsResult));
      component.openEditInterests();
      tick();
      fixture.detectChanges();
      expect(editInterestDialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function));
      expect(portfolioServiceSpy.saveInterest).toHaveBeenCalledWith(interestsResult);
      expect(component.user.studentDetails!.interests).toEqual(interestsResult);
    }));

    it('openEditDialog should update skills when dialog returns a result (for languages)', fakeAsync(() => {
      const skillsResult = [{ id: 's3', name: 'Language2', isLanguage: true }];
      // Set an initial non-language skill.
      component.user.studentDetails!.skills = [{ id: 's4', name: 'Skill2', isLanguage: false }];
      editDialogSpy.open.and.returnValue(fakeDialogRef(skillsResult));
      component.openEditDialog(true);
      tick();
      fixture.detectChanges();
      expect(editDialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function));
      expect(portfolioServiceSpy.saveSkills).toHaveBeenCalledWith([
        { id: 's4', name: 'Skill2', isLanguage: false },
        { id: 's3', name: 'Language2', isLanguage: true }
      ]);
    }));


    it('openEditDialog should do nothing if dialog returns undefined', () => {
      editDialogSpy.open.and.returnValue(fakeDialogRef(undefined));
      const initialSkills = component.user.studentDetails!.skills;
      component.openEditDialog(false);
      fixture.detectChanges();
      expect(portfolioServiceSpy.saveSkills).not.toHaveBeenCalled();
      expect(component.user.studentDetails!.skills).toBe(initialSkills);
    });



    it('openEditPersonalInfoDialog should call user.setPersonalInfo when dialog returns a value', () => {
      const personalInfo = { firstName: 'John', lastName: 'Doe' };
      editPersonalInfoDialogSpy.open.and.returnValue(fakeDialogRef(personalInfo));
      component.openEditPersonalInfoDialog();
      fixture.detectChanges();
      expect(component.user.setPersonalInfo).toHaveBeenCalledWith(personalInfo);
    });

    it('openEditPersonalInfoDialog should do nothing if dialog returns undefined', () => {
      editPersonalInfoDialogSpy.open.and.returnValue(fakeDialogRef(undefined));
      component.openEditPersonalInfoDialog();
      fixture.detectChanges();
      expect(component.user.setPersonalInfo).not.toHaveBeenCalled();
    });


    it('openAddProjectModal should push project to studentDetails.projects when dialog returns a result', fakeAsync(() => {
      const projectRequest: any = { name: 'New Project' };
      component.user.studentDetails!.projects = [];
      addProjectDialogueSpy.open.and.returnValue(fakeDialogRef(projectRequest));
      component.openAddProjectModal();
      tick();
      fixture.detectChanges();
      expect(projectServiceSpy.saveProject).toHaveBeenCalledWith(projectRequest);
      expect(component.user.studentDetails!.projects).toContain(jasmine.objectContaining({ id: 'project-1' }));
    }));


    it('openEditProjectModal should update an existing project in studentDetails.projects', () => {
      const existingProject: any = { id: 'project-2', name: 'Old Project', studentDetailsID: dummyStudentDetails.id };
      component.user.studentDetails!.projects = [existingProject];
      const projectRequest: any = { name: 'Updated Project' };
      addProjectDialogueSpy.open.and.returnValue(fakeDialogRef(projectRequest));
      component.openEditProjectModal(existingProject);
      fixture.detectChanges();
      expect(projectServiceSpy.saveProject).toHaveBeenCalled();
      const updated = component.user.studentDetails!.projects.find((p: any) => p.id === existingProject.id);
      expect(updated).toBeTruthy(); // Ensures that 'updated' is not undefined
      expect(updated!.name).toBe('Updated Project');
    });

  });

  describe('Utility methods', () => {
    it('majors should return only non-minor degree programs', () => {
      const degreePrograms = [
        { id: 'dp1', studentDetailsID: dummyStudentDetails.id, name: 'Major1', isMinor: false },
        { id: 'dp2', studentDetailsID: dummyStudentDetails.id, name: 'Minor1', isMinor: true }
      ];
      component.user.studentDetails!.degreePrograms = degreePrograms;
      expect(component.majors()).toEqual(['Major1']);
    });

    it('minors should return only minor degree programs', () => {
      const degreePrograms = [
        { id: 'dp1', studentDetailsID: dummyStudentDetails.id, name: 'Major1', isMinor: false },
        { id: 'dp2', studentDetailsID: dummyStudentDetails.id, name: 'Minor1', isMinor: true }
      ];
      component.user.studentDetails!.degreePrograms = degreePrograms;
      expect(component.minors()).toEqual(['Minor1']);
    });


    it('skills should return non-language skills only', () => {
      const skills = [
        { id: 's1', name: 'Skill1', isLanguage: false },
        { id: 's2', name: 'Language1', isLanguage: true }
      ];
      component.user.studentDetails!.skills = skills;
      expect(component.skills()).toEqual(['Skill1']);
    });

    it('jobs should return non-coop jobs sorted descending by startDate', () => {
      const jobs: any[] = [
        { id: 'j1', name: 'Job1', isCoop: false, startDate: '2020-01-01', location: 'A' },
        { id: 'j2', name: 'Job2', isCoop: false, startDate: '2021-01-01', location: 'B' },
        { id: 'j3', name: 'Job3', isCoop: true, startDate: '2022-01-01', location: 'C' }
      ];
      component.user.studentDetails!.jobs = jobs;
      const result = component.jobs();
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('j2');
      expect(result[1].id).toBe('j1');
    });

    it('coops should return only coop jobs', () => {
      const jobs: any[] = [
        {
          id: 'j1',
          name: 'Job1',
          isCoop: false,
          startDate: new Date('2020-01-01'),
          location: 'A',
          description: 'desc',
          endDate: new Date('2020-12-31'),
          studentDetailsID: dummyStudentDetails.id,
        },
        {
          id: 'j2',
          name: 'Job2',
          isCoop: true,
          startDate: new Date('2021-01-01'),
          location: 'B',
          description: 'desc',
          endDate: new Date('2021-12-31'),
          studentDetailsID: dummyStudentDetails.id,
        }
      ];
      component.user.studentDetails!.jobs = jobs;
      const result = component.coops();
      expect(result).toEqual([{
        id: 'j2',
        name: 'Job2',
        isCoop: true,
        startDate: new Date('2021-01-01'),
        location: 'B',
        description: 'desc',
        endDate: new Date('2021-12-31'),
        studentDetailsID: dummyStudentDetails.id,
      }]);
    });



    it('languages should return only language skills', () => {
      const skills = [
        { id: 's1', name: 'Skill1', isLanguage: false },
        { id: 's2', name: 'Language1', isLanguage: true }
      ];
      component.user.studentDetails!.skills = skills;
      expect(component.languages()).toEqual(['Language1']);
    });

    it('dateHeader should return header with ":" (since isMobile$ is truthy as an Observable)', () => {
      expect(component.dateHeader('Test')).toEqual('Test:');
    });

    it('formatDate should return "Ongoing" if date is null', () => {
      expect(component.formatDate(null)).toBe('Ongoing');
    });

    // Utility methods
    it('formatDate should format the date correctly', () => {
      const date = new Date('2020-01-01T00:00:00Z');
      // Set isMobile$ to false so that the component uses the long format.
      (component as any).isMobile$ = false;
      const expected = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        day: "numeric"
      });
      expect(component.formatDate(date)).toEqual(expected);
    });


  });

  describe('Job and Club operations', () => {
    it('createJob should add a job to studentDetails.jobs when dialog returns a value', () => {
      const job: any = { id: 'j4', name: 'Job4', isCoop: false, startDate: '2023-01-01', location: 'D' };
      saveJobDialogSpy.open.and.returnValue(fakeDialogRef(job));
      component.user.studentDetails!.jobs = [];
      component.createJob();
      fixture.detectChanges();
      expect(component.user.studentDetails!.jobs).toContain(job);
    });

    it('editJob should update a job in studentDetails.jobs', () => {
      const job: any = { id: 'j5', name: 'Job5', isCoop: false, startDate: '2022-01-01', location: 'E' };
      component.user.studentDetails!.jobs = [job];
      const updatedJob: any = { id: 'j5', name: 'Job5 Updated', isCoop: false, startDate: '2022-01-01', location: 'E' };
      saveJobDialogSpy.open.and.returnValue(fakeDialogRef(updatedJob));
      component.editJob(job);
      fixture.detectChanges();
      expect(component.user.studentDetails!.jobs[0].name).toBe('Job5 Updated');
    });

    it('editJob should initialize studentDetails if undefined', () => {
      component.user.studentDetails = undefined;
      const job: any = { id: 'j6', name: 'Job6', isCoop: false, startDate: '2022-01-01', location: 'F' };
      const updatedJob: any = { id: 'j6', name: 'Job6 Updated', isCoop: false, startDate: '2022-01-01', location: 'F' };
      saveJobDialogSpy.open.and.returnValue(fakeDialogRef(updatedJob));
      component.editJob(job);
      fixture.detectChanges();
      expect(component.user.studentDetails).toBeDefined();
    });

    it('confirmDelete should remove a job from studentDetails.jobs on success', fakeAsync(() => {
      const job: any = { id: 'j7', name: 'Job7', isCoop: false, startDate: '2022-01-01', location: 'G' };
      component.user.studentDetails!.jobs = [job];
      component.confirmDelete(job);
      tick();
      fixture.detectChanges();
      expect(jobServiceSpy.deleteJob).toHaveBeenCalledWith(job.id);
      expect(deleteDialogSpy.closeAll).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Job deleted successfully.', 'Close', { duration: 5000 });
      expect(component.user.studentDetails!.jobs).not.toContain(job);
    }));

    it('confirmDelete should show an error message when deletion fails', fakeAsync(() => {
      const job: any = { id: 'j8', name: 'Job8', isCoop: false, startDate: '2022-01-01', location: 'H' };
      component.user.studentDetails!.jobs = [job];
      const errorResponse = new Error('Delete failed');
      jobServiceSpy.deleteJob.and.returnValue(throwError(() => errorResponse));
      component.confirmDelete(job);
      tick();
      fixture.detectChanges();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to delete job.', 'Close', { duration: 5000 });
    }));

    it('deleteClub should open a confirmation dialog with proper data', () => {
      const club: any = { id: 'c1', name: 'Club1' };
      saveClubDialogSpy.open.and.returnValue(fakeDialogRef(undefined));
      component.deleteClub(club);
      expect(saveClubDialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            entityId: club.id,
            title: 'Delete Club?',
            action: `delete the club ${club.name}`
          })
        })
      );
    });

    it('confirmDeleteClub should remove a club from studentDetails.clubs on success', () => {
      const club: any = { id: 'c2', name: 'Club2' };
      component.user.studentDetails!.clubs = [club];
      component.confirmDeleteClub(club);
      fixture.detectChanges();
      expect(portfolioServiceSpy.deleteClub).toHaveBeenCalledWith(club.id);
      expect(deleteDialogSpy.closeAll).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Club deleted successfully.', 'Close', { duration: 5000 });
      expect(component.user.studentDetails!.clubs).not.toContain(club);
    });

    it('deleteJob should open a confirmation dialog with proper data', () => {
      const job: any = { id: 'j9', name: 'Job9', isCoop: false, startDate: '2022-01-01', location: 'I' };
      saveJobDialogSpy.open.and.returnValue(fakeDialogRef(undefined));
      component.deleteJob(job);
      expect(saveJobDialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            entityId: 'j9',
            title: 'Delete Job?',
            action: 'delete the job "Job9" at "I"',
            onConfirm: jasmine.any(Function)
          })
        })
      );

    });

    it('deleteProject should open a confirmation dialog with proper data', () => {
      const project: any = { id: 'p1', name: 'Project1', studentDetailsID: dummyStudentDetails.id };
      addProjectDialogueSpy.open.and.returnValue(fakeDialogRef(undefined));
      component.deleteProject(project);
      expect(addProjectDialogueSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            entityId: project.id,
            title: 'Delete this Project?',
            action: `delete the project "Project1"?`
          })
        })
      );
    });

    it('confirmProjectDelete should remove a project from studentDetails.projects on success', () => {
      const project: any = { id: 'p2', name: 'Project2', studentDetailsID: dummyStudentDetails.id };
      component.user.studentDetails!.projects = [project];
      component.confirmProjectDelete(project);
      fixture.detectChanges();
      expect(projectServiceSpy.deleteProject).toHaveBeenCalledWith(project.id);
      expect(deleteDialogSpy.closeAll).toHaveBeenCalled();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Project deleted successfully.', 'Close', { duration: 5000 });
      expect(component.user.studentDetails!.projects).not.toContain(project);
    });
  });

  describe('currentUserMatchesPortfolioUser', () => {
    it('should return true when the authenticated user id matches the portfolio user id', fakeAsync(() => {
      authServiceSpy.user$ = of(dummyUser);
      component.currentUserMatchesPortfolioUser().subscribe((matches) => {
        expect(matches).toBeTrue();
      });
    }));

    it('currentUserMatchesPortfolioUser should return false when the ids do not match', fakeAsync(() => {
      // Recreate the component to use the new user$ value.
      authServiceSpy.user$ = of(new DummyUser({ ...dummyUser, id: 'different-id' }) as unknown as User);
      // Manually create a new instance of the component to capture the new authServiceSpy.user$.
      const fixtureNew = TestBed.createComponent(PortfolioComponent);
      const compNew = fixtureNew.componentInstance;
      compNew.user = new DummyUser({ ...dummyUser, id: 'id-2' }) as unknown as User;
      let result: boolean | undefined;
      compNew.currentUserMatchesPortfolioUser().subscribe((matches) => result = matches);
      tick();
      expect(result).toBeFalse();
    }));
  });
});
