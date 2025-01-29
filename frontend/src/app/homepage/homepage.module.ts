import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { MatCardModule } from "@angular/material/card";
import { EventsComponent } from './events/events.component';
import { MilestonesModule } from "../milestones-page/milestones/milestones.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TaskSubmitButtonModule } from '../task-submit-button/task-submit-button.module';
import { TasksModule } from "../tasks/tasks.module";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HotlinkModule } from '../hotlink/hotlink.module';
import { SupportSectionComponent } from './support-section/support-section.component';
import { CareerSearchComponent } from './career-search/career-search.component';


@NgModule({
  declarations: [
    HomepageComponent,
    EventsComponent,
    SupportSectionComponent,
    CareerSearchComponent

  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MilestonesModule,
    CarouselModule,
    TasksModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    HotlinkModule,
  ]
})
export class HomepageModule { }
