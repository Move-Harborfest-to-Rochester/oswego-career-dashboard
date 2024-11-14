import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterestsComponent } from './edit-interests.component';

describe('EditInterestsComponent', () => {
  let component: EditInterestsComponent;
  let fixture: ComponentFixture<EditInterestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditInterestsComponent]
    });
    fixture = TestBed.createComponent(EditInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
