import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SupportSectionComponent} from './support-section.component';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {
  MilestonesModule
} from "../../milestones-page/milestones/milestones.module";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {TasksModule} from "../../tasks/tasks.module";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {HotlinkModule} from "../../hotlink/hotlink.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('SupportSectionComponent', () => {
  let component: SupportSectionComponent;
  let fixture: ComponentFixture<SupportSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportSectionComponent],
      imports: [
        CommonModule,
        MatCardModule,
        MilestonesModule,
        CarouselModule,
        TasksModule,
        NgOptimizedImage,
        MatButtonModule,
        MatIconModule,
        HotlinkModule,
        HttpClientTestingModule,
      ]
    });
    fixture = TestBed.createComponent(SupportSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
