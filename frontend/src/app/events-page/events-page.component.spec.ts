import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EventsPageComponent } from './events-page.component';

import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { of } from 'rxjs';
import {AuthService} from "../security/auth.service";

describe('EventsPageComponent', () => {
  let component: EventsPageComponent;
  let fixture: ComponentFixture<EventsPageComponent>;

  // Mocking MsalService
  const mockMsalService = jasmine.createSpyObj('MsalService', [
    'loginPopup',
    'logout',
    'acquireTokenSilent',
    'handleRedirectObservable'
  ]);

  // Mocking MsalBroadcastService
  const mockMsalBroadcastService = jasmine.createSpyObj('MsalBroadcastService', ['msalSubject$']);
  mockMsalBroadcastService.msalSubject$ = of(); // Return an empty observable

  // Mocking SocialAuthService
  const mockSocialAuthService = jasmine.createSpyObj('SocialAuthService', ['signIn', 'signOut', 'authState']);
  mockSocialAuthService.authState = of(null); // Return an empty observable

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatProgressSpinnerModule
      ],
      declarations: [EventsPageComponent],
      providers: [
        AuthService,
        { provide: MsalService, useValue: mockMsalService },
        { provide: MsalBroadcastService, useValue: mockMsalBroadcastService },
        { provide: SocialAuthService, useValue: mockSocialAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
