import {Component, AfterViewInit, QueryList, ViewChildren, ElementRef, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {BasacFaculty} from "../../../domain/BasacFaculty";
import {BasacFacultyService} from "../../admin/edit-basac-faculty-form/basac-faculty.service";

@Component({
  selector: 'app-support-section',
  templateUrl: './support-section.component.html',
  styleUrls: ['./support-section.component.less']
})
export class SupportSectionComponent implements OnInit {
  tabs = [
    { label: 'BASAC Office' },
    { label: 'Faculty Career Mentor' },
    { label: 'Professional Templates' },
    { label: 'LinkedIn Learning' },
    { label: 'Contacts for Support' }
  ];
  selectedTab = 0;
  @ViewChildren('tabContent') tabContents!: QueryList<ElementRef>;

  basacFaculty$!: Observable<BasacFaculty[]>;

  constructor(private readonly basacFacultyService: BasacFacultyService) {
  }

  ngOnInit(): void {
    this.basacFaculty$ = this.basacFacultyService.getAll();
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }
}
