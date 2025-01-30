import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerSearchComponent } from './career-search.component';

describe('CareerSearchComponent', () => {
  let component: CareerSearchComponent;
  let fixture: ComponentFixture<CareerSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerSearchComponent]
    });
    fixture = TestBed.createComponent(CareerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
