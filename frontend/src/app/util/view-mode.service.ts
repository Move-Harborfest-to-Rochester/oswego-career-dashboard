import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private isStudentViewSubject = new BehaviorSubject<boolean>(false);
  isStudentView$ = this.isStudentViewSubject.asObservable();

  constructor(private router: Router) {}

  toggleViewMode(): void {
    const newMode = !this.isStudentViewSubject.value;
    this.isStudentViewSubject.next(newMode);

    if (newMode) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  getViewMode(): boolean {
    return this.isStudentViewSubject.value;
  }
}
