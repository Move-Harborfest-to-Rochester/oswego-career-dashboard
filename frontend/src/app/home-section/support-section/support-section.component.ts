import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-support-section',
  templateUrl: './support-section.component.html',
  styleUrls: ['./support-section.component.less']
})
export class SupportSectionComponent implements AfterViewInit {
  tabs = [
    { label: 'Faculty Career Mentor' },
    { label: 'BASAC Office' },
    { label: 'Resume & CV Templates' },
    { label: 'LinkedIn Learning' },
    { label: 'Contacts for Support' }
  ];

  selectedTab = 0;

  @ViewChildren('tabContent') tabContents!: QueryList<ElementRef>;

  selectTab(index: number) {
    this.selectedTab = index;
    this.setMaxHeight();
  }

  ngAfterViewInit() {
    this.setMaxHeight();
  }

  setMaxHeight() {
    const tabBodies = this.tabContents.toArray();
    // Find the maximum height from all tab contents
    const maxHeight = Math.max(...tabBodies.map(tab => tab.nativeElement.offsetHeight));

    tabBodies.forEach(tab => {
      tab.nativeElement.style.minHeight = `${maxHeight}px`;
    });
  }

}
