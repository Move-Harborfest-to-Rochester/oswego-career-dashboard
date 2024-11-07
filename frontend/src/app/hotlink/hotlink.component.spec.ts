import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotlinkComponent } from './hotlink.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

describe('HotlinkComponent', () => {
  let component: HotlinkComponent;
  let fixture: ComponentFixture<HotlinkComponent>;

  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [HotlinkComponent],
      imports: [
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    fixture = TestBed.createComponent(HotlinkComponent);
    component = fixture.componentInstance;
    component.title = 'Test';
    component.description = 'Go to /test';
    component.link = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to link', () => {
    component.navigate();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['test'], {
      fragment: undefined
    });
  });

  it('should navigate to link with fragment', () => {
    component.fragment = 'fragment'
    component.navigate();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['test'], {
      fragment: 'fragment'
    });
  });
});
