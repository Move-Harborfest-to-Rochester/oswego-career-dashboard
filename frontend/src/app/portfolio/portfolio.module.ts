import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { SaveJobDialogModule } from './save-job-dialog/save-job-dialog.module';
import { PortfolioComponent } from "./portfolio.component";
import { ResumeModule } from './resume/resume.module';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.module';
import { EducationSectionModule } from './education-section/education-section.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PortfolioComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule,
    MatButtonModule,
    ResumeModule,
    MatIconModule,
    SaveJobDialogModule,
    ConfirmationDialogModule,
    EducationSectionModule,
    HttpClientModule
  ]
})
export class PortfolioModule { }
