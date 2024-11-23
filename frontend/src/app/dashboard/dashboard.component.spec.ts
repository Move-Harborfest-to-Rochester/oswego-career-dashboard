import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import {MockComponent} from "ng-mocks";
import {EventsComponent} from "./events/events.component";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import { TasksComponent } from '../tasks/tasks.component';
import { HotlinkModule } from '../hotlink/hotlink.module';
import { JobSitesComponent } from './job-sites/job-sites.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, , MockComponent(JobSitesComponent), MockComponent(EventsComponent), MockComponent(MilestonesComponent), MockComponent(TasksComponent)],
      imports: [
        HotlinkModule
      ]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
