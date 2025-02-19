import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constructBackendRequest } from 'src/app/util/http-helper';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.less']
})
export class AnalyticsDashboardComponent {
  selectedOption1: string = 'All'; // Default selected radio button
  selectedOption2: string = 'Resume'; // Second set of radio buttons
  apiData: any;
  selectedDataField: string = 'has_resume';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.callApi(this.selectedOption1);  // Call API with the default 'All' option
  }

  onRadioChange(selectedOption1: string) {
    this.callApi(selectedOption1);
  }

  onRadioChange2(selectedOption2: string) {
    this.formatDataBasedOnSelectedOption(selectedOption2);
  }

  callApi(selectedOption: string) {
    const apiKey = this.getApiKeyBasedOnSelection(selectedOption);
    const apiUrl = constructBackendRequest(`stats/${apiKey}`);
    console.log(`Selected Option: ${selectedOption}`);
    console.log(`API Key: ${apiKey}`);
    console.log(`apiURL: ${apiUrl}`);
    // Make the API request
    this.http.get(apiUrl).subscribe(
      (data) => {
        this.apiData = this.formatData(data);  // Store the response in the apiData variable
        console.log('API Data:', this.apiData);
      },
      (error) => {
        console.error('API Error:', error);  // Log any error
      }
    );
  }

  // Format the API data to map static grade years to API data
  formatData(data: any): any[] {
    const formattedData = [
      { year: 'Total', yes: data['Total']?.[this.selectedDataField], no: data['Total']?.Count - data['Total']?.[this.selectedDataField], total: data['Total']?.Count},
      { year: 'Freshman', yes: data['Freshman']?.[this.selectedDataField], no: data['Freshman']?.Count - data['Freshman']?.[this.selectedDataField], total: data['Freshman']?.Count},
      { year: 'Sophomore', yes: data['Sophomore']?.[this.selectedDataField], no: data['Sophomore']?.Count - data['Sophomore']?.[this.selectedDataField], total: data['Sophomore']?.Count },
      { year: 'Junior', yes: data['Junior']?.[this.selectedDataField], no: data['Junior']?.Count - data['Junior']?.[this.selectedDataField], total: data['Junior']?.Count},
      { year: 'Senior', yes: data['Senior']?.[this.selectedDataField], no: data['Senior']?.Count - data['Senior']?.[this.selectedDataField], total: data['Senior']?.Count }
    ];

    return formattedData;
  }

  formatDataBasedOnSelectedOption(selectedOption2: string) {
    console.log('selected 2:', this.selectedOption2);
    switch (selectedOption2) {
      case 'Resume':
        this.selectedDataField = 'has_resume';
        break;
      case 'Internship':
        this.selectedDataField = 'has_internship';
        break;
      case 'InternshipThisYear':
        this.selectedDataField = 'done_internship_this_year';
        break;
      case 'InternshipLastYear':
        this.selectedDataField = 'done_internship_last_year';
        break;
      default:
        this.selectedDataField = 'has_resume';  // Default to 'has_resume'
        break;
    }
    this.callApi(this.selectedOption1);
  }

  getApiKeyBasedOnSelection(selectedOption: string): string {
    switch (selectedOption) {
      case 'All':
        return 'All';
      case 'Accounting':
        return 'Accounting';
      case 'BusinessAdministration':
        return 'Business Administration';
      case 'Finance':
        return 'Finance';
      case 'HumanResourceManagement':
        return 'Human Resource Management';
      case 'Marketing':
        return 'Marketing';
      case 'OperationsManagementAndInformationSystems':
        return 'Operations Management and Information Systems';
      case 'RiskManagementAndInsurance':
        return 'Risk Management and Insurance';
      default:
        return '';
    }
  }
}
