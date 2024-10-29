import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { MockComponent } from 'ng-mocks';
import { OswegoLogoComponent } from '../oswego-logo/oswego-logo.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule} from '@angular/common/http/testing';


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [MockComponent(OswegoLogoComponent), MatIconModule,HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
