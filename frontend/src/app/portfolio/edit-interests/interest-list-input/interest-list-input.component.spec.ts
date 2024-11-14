import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestListInputComponent } from './interest-list-input.component';

describe('InterestListInputComponent', () => {
  let component: InterestListInputComponent;
  let fixture: ComponentFixture<InterestListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestListInputComponent]
    });
    fixture = TestBed.createComponent(InterestListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
