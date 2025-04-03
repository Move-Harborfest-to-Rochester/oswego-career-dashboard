import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditYearMenuComponent} from './edit-year-menu.component';
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthService} from "../../security/auth.service";
import {MatMenuModule} from "@angular/material/menu";
import {userJSON} from "../../security/auth.service.spec";
import {User} from "../../security/domain/user";
import {of} from "rxjs";

describe('EditYearMenuComponent', () => {
  let component: EditYearMenuComponent;
  let fixture: ComponentFixture<EditYearMenuComponent>;
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['user$'], {user$: of(new User(userJSON))});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditYearMenuComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatMenuModule],
      providers: [
        {provide: AuthService, useValue: authServiceSpy}
      ]
    });
    fixture = TestBed.createComponent(EditYearMenuComponent);
    component = fixture.componentInstance;
    component.targetStudent = new User(userJSON);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
