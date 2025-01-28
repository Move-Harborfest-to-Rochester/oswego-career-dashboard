import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveClubDialogComponent } from './save-club-dialog.component';

describe('SaveClubDialogComponent', () => {
  let component: SaveClubDialogComponent;
  let fixture: ComponentFixture<SaveClubDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveClubDialogComponent]
    });
    fixture = TestBed.createComponent(SaveClubDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
