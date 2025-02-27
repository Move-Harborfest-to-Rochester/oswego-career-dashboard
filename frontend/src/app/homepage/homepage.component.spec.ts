import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import {MockComponent} from "ng-mocks";
import {EventsComponent} from "./events/events.component";
import {MilestonesComponent} from "../milestones-page/milestones/milestones.component";
import { TasksComponent } from '../tasks/tasks.component';
import { HotlinkModule } from '../hotlink/hotlink.module';
import { SupportSectionComponent } from './support-section/support-section.component';
import { CareerSearchComponent } from './career-search/career-search.component';


describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageComponent, 
        MockComponent(EventsComponent), 
        MockComponent(MilestonesComponent), 
        MockComponent(TasksComponent), 
        MockComponent(CareerSearchComponent),
        MockComponent(SupportSectionComponent)],
      imports: [
        HotlinkModule
      ]
    });
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
