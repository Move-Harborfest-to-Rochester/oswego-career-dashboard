import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { CreateJobDialogModule } from './create-job-dialog/create-job-dialog.module';
import { PortfolioComponent } from "./portfolio.component";
import { ResumeModule } from './resume/resume.module';

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
    CreateJobDialogModule
  ]
})
export class PortfolioModule { }
