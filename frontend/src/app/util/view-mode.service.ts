import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private isStudentViewSubject = new BehaviorSubject<boolean>(false);
  isStudentView$ = this.isStudentViewSubject.asObservable();

  toggleViewMode(): void {
    this.isStudentViewSubject.next(!this.isStudentViewSubject.value);
  }

  getViewMode(): boolean {
    return this.isStudentViewSubject.value;
  }
}
