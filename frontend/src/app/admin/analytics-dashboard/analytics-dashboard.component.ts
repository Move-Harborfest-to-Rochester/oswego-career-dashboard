import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.less']
})
export class AnalyticsDashboardComponent {
  selectedOption1: string = 'All'; // Default selected radio button
  selectedOption2: string = 'Resume'; // Second set of radio buttons

}
