import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { MockComponent } from "ng-mocks";
import { EventsComponent } from "./events/events.component";
import { MilestonesComponent } from "../milestones-page/milestones/milestones.component";
import { TasksComponent } from '../tasks/tasks.component';
import { HotlinkModule } from '../hotlink/hotlink.module';
import { SupportSectionComponent } from './support-section/support-section.component';
import { CareerSearchComponent } from './career-search/career-search.component';
import { AuthService } from '../security/auth.service';
import SpyObj = jasmine.SpyObj;
import { map, Subject } from 'rxjs';
import { User, UserJSON } from '../security/domain/user';
import { userJSON } from '../security/auth.service.spec';


describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let userSubject: Subject<UserJSON> = new Subject<UserJSON>();
  let user: UserJSON = userJSON;
  let authSvcSpy: SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [],
    {user$: userSubject.pipe(map(userJson => new User(userJson))) });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageComponent,
        MockComponent(EventsComponent),
        MockComponent(MilestonesComponent),
        MockComponent(TasksComponent),
        MockComponent(CareerSearchComponent),
        MockComponent(SupportSectionComponent)],
      providers: [
        { provide: AuthService, useValue: authSvcSpy },
      ],
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
