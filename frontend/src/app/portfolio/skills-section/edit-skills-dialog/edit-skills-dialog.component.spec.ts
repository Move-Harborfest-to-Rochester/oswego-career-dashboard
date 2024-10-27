import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillsDialogComponent } from './edit-skills-dialog.component';

describe('EditSkillsDialogComponent', () => {
  let component: EditSkillsDialogComponent;
  let fixture: ComponentFixture<EditSkillsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSkillsDialogComponent]
    });
    fixture = TestBed.createComponent(EditSkillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
