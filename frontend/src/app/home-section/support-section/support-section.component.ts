import { Component } from '@angular/core';

@Component({
  selector: 'app-support-section',
  templateUrl: './support-section.component.html',
  styleUrls: ['./support-section.component.less']
})
export class SupportSectionComponent {
  tabs = [
    { label: 'Faculty Career Mentor' },
    { label: 'BASAC Office' },
    { label: 'Resume & CV Templates' },
    { label: 'LinkedIn Learning' },
    { label: 'Contacts for Support' }

  ];
  selectedTab = 0;

  selectTab(index: number) {
    this.selectedTab = index;
  }
}
