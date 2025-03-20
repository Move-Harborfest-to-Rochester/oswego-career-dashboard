import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDropdownComponent } from './club-dropdown.component';

describe('ClubDropdownComponent', () => {
  let component: ClubDropdownComponent;
  let fixture: ComponentFixture<ClubDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubDropdownComponent]
    });
    fixture = TestBed.createComponent(ClubDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
