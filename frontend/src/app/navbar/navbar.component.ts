import { Component } from '@angular/core';
import {AuthService} from "../security/auth.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {User} from "../security/domain/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  navLinks: Array<{ path: string, label: string }> = [];
  isStudentView: boolean = false; // Tracks whether the admin is viewing as an admin

  studentLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/milestones", label: "Milestones" }
  ];

  facultyLinks = [
    { path: "/faculty/users", label: "Users" },
  ];

  adminLinks = [...this.facultyLinks,
    { path: "/admin/milestones", label: "Milestones" },
    { path: "/admin/tasks", label: "Tasks" },
    { path: "/admin/events", label: "Events" }
  ];

  constructor(public readonly authService: AuthService) {
    authService.user$.pipe(takeUntilDestroyed()).subscribe((user: User | null) => {
      if (user?.hasAdminPrivileges()) {
        this.setNavLinks();
      }
      else if (user?.hasFacultyPrivileges()) {
        this.navLinks = this.facultyLinks;
      }
      else {
        this.navLinks = this.studentLinks;
      }
    });
  }

  toggleViewMode(): void {
    this.isStudentView = !this.isStudentView;
    this.setNavLinks();
  }

  /**
   * Sets nav links based on the current mode.
   */
  private setNavLinks(): void {
    this.navLinks = this.isStudentView ? this.studentLinks : this.adminLinks;
  }
}
