import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSectionComponent } from './support-section.component';

describe('SupportSectionComponent', () => {
  let component: SupportSectionComponent;
  let fixture: ComponentFixture<SupportSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportSectionComponent]
    });
    fixture = TestBed.createComponent(SupportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
