import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import {PortfolioComponent} from "./portfolio.component";
import {MilestonesModule} from "../milestones-page/milestones/milestones.module";
import {MatButtonModule} from "@angular/material/button";
import { ResumeModule } from './resume/resume.module';
import { MatIconModule } from '@angular/material/icon';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ConfirmationDialogComponent} from '../common/confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    PortfolioComponent,
    AddProjectModalComponent,
    ConfirmationDialogComponent,
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



  ]
})
export class PortfolioModule { }
