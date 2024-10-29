import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsListInputComponent } from './skills-list-input.component';

describe('SkillsListInputComponent', () => {
  let component: SkillsListInputComponent;
  let fixture: ComponentFixture<SkillsListInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsListInputComponent]
    });
    fixture = TestBed.createComponent(SkillsListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
