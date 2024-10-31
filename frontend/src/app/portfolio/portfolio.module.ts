import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { EditPersonalInfoDialogModule } from './edit-personal-info-dialog/edit-personal-info-dialog.module';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { SaveJobDialogModule } from './save-job-dialog/save-job-dialog.module';
import { PortfolioComponent } from "./portfolio.component";
import { ResumeModule } from './resume/resume.module';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.module';

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
    EditPersonalInfoDialogModule,
  ]
})
export class PortfolioModule { }
