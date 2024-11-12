import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { EditPersonalInfoDialogModule } from './edit-personal-info-dialog/edit-personal-info-dialog.module';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ConfirmationDialogComponent} from '../common/confirmation-dialog/confirmation-dialog.component';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { SaveJobDialogModule } from './save-job-dialog/save-job-dialog.module';
import { PortfolioComponent } from "./portfolio.component";
import { ResumeModule } from './resume/resume.module';
import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.module';
import { EducationSectionModule } from './education-section/education-section.module';
import { HttpClientModule } from '@angular/common/http';
import { SupportSectionComponent } from '../home-section/support-section/support-section.component';


@NgModule({
  declarations: [
    PortfolioComponent,
    AddProjectModalComponent,
    SupportSectionComponent
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
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SaveJobDialogModule,
    ConfirmationDialogModule,
    EditPersonalInfoDialogModule,
    EducationSectionModule,
    HttpClientModule

  ]
})
export class PortfolioModule { }
