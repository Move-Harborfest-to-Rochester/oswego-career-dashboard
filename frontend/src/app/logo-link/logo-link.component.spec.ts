import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoLinkComponent } from './logo-link.component';

describe('LogoLinkComponent', () => {
  let component: LogoLinkComponent;
  let fixture: ComponentFixture<LogoLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogoLinkComponent]
    });
    fixture = TestBed.createComponent(LogoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
