import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';

import { MilestonesModule } from '../milestones-page/milestones/milestones.module';
import { EducationSectionModule } from './education-section/education-section.module';
import { ResumeModule } from './resume/resume.module';
import { DegreeProgramListInputModule } from './education-section/edit-education-dialog/degree-program-list-input/degree-program-list-input.module';
import { SaveJobDialogModule } from './save-job-dialog/save-job-dialog.module';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.module';
import { EditPersonalInfoDialogModule } from './edit-personal-info-dialog/edit-personal-info-dialog.module';

import { PortfolioComponent } from './portfolio.component';
import { SkillsSectionComponent } from './skills-section/skills-section.component';
import { EditSkillsDialogComponent } from './skills-section/edit-skills-dialog/edit-skills-dialog.component';
import { SkillsListInputComponent } from './skills-section/edit-skills-dialog/skills-list-input/skills-list-input.component';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';


@NgModule({
  declarations: [
    PortfolioComponent,
    SkillsSectionComponent,
    EditSkillsDialogComponent,
    SkillsListInputComponent,
    AddProjectModalComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule,
    MatButtonModule,
    ResumeModule,
    MatIconModule,
    EducationSectionModule,
    HttpClientModule,
    DegreeProgramListInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    SaveJobDialogModule,
    ConfirmationDialogModule,
    MatDatepickerModule,
    EditPersonalInfoDialogModule
  ],
})
export class PortfolioModule { }
