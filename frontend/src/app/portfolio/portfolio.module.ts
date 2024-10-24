import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { SaveJobDialogModule } from './save-job-dialog/save-job-dialog.module';
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
    SaveJobDialogModule
  ]
})
export class PortfolioModule { }
