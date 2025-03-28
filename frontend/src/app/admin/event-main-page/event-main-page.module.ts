import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { EventMainPageComponent } from './event-main-page.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from "@angular/material/button";
import { EventEditModalModule } from '../event-edit-modal/event-edit-modal.module';
import {MatIconModule} from "@angular/material/icon";
import {FileUploadModule} from "../../file-upload/file-upload.module";
import {TaskSubmitButtonModule} from "../../task-submit-button/task-submit-button.module";
import {MatCardModule} from '@angular/material/card';

@NgModule({
    declarations: [
        EventMainPageComponent
    ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    EventEditModalModule,
    MatIconModule,
    FileUploadModule,
    TaskSubmitButtonModule,
    NgOptimizedImage,
    MatCardModule
  ]
})
export class EventMainPageModule { }
