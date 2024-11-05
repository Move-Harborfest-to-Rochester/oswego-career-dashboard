import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MilestonesModule } from '../milestones-page/milestones/milestones.module';
import { EducationSectionModule } from './education-section/education-section.module';
import { PortfolioComponent } from './portfolio.component';
import { ResumeModule } from './resume/resume.module';
import { SkillsSectionComponent } from './skills-section/skills-section.component';
import { EditSkillsDialogComponent } from './skills-section/edit-skills-dialog/edit-skills-dialog.component';
import {
  DegreeProgramListInputModule
} from "./education-section/edit-education-dialog/degree-program-list-input/degree-program-list-input.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import { SkillsListInputComponent } from './skills-section/edit-skills-dialog/skills-list-input/skills-list-input.component';
import {SaveJobDialogModule} from "./save-job-dialog/save-job-dialog.module";
import {ConfirmationDialogModule} from "../common/confirmation-dialog/confirmation-dialog.module";

@NgModule({
  declarations: [PortfolioComponent, SkillsSectionComponent, EditSkillsDialogComponent, SkillsListInputComponent],
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
  ],
})
export class PortfolioModule { }
