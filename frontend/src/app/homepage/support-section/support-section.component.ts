import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-support-section',
  templateUrl: './support-section.component.html',
  styleUrls: ['./support-section.component.less']
})
export class SupportSectionComponent{
  tabs = [
    { label: 'BASAC Office' },
    { label: 'Faculty Career Mentor' },
    { label: 'Professional Templates' },
    { label: 'LinkedIn Learning' },
    { label: 'Contacts for Support' }
  ];

  selectedTab = 0;

  @ViewChildren('tabContent') tabContents!: QueryList<ElementRef>;

  selectTab(index: number) {
    this.selectedTab = index;
  }

}
