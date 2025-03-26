import { Component, DestroyRef, OnInit, inject, NgZone } from '@angular/core';
import { AuthService } from "../security/auth.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { User } from "../security/domain/user";
import { ViewModeService } from "../util/view-mode.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);

  navLinks: Array<{ path: string, label: string }> = [];
  isStudentView: boolean = false;

  studentLinks = [
    { path: "/portfolio", label: "Portfolio" },
    { path: "/milestones", label: "Milestones" }
  ];

  facultyLinks = [
    { path: "/faculty/users", label: "Users" },
  ];

  adminLinks = [
    ...this.facultyLinks,
    { path: "/admin/milestones", label: "Milestones" },
    { path: "/admin/tasks", label: "Tasks" },
    { path: "/admin/events", label: "Events" },
    { path: "/admin/analytics", label: "Analytics"},
  ];

  constructor(
    public readonly authService: AuthService,
    public readonly viewModeService: ViewModeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.user$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((user: User | null) => {
      if (user?.hasAdminPrivileges()) {
        // Subscribe to view mode changes
        this.viewModeService.isStudentView$.pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => this.setNavLinks());

        this.setNavLinks();
      } else if (user?.hasFacultyPrivileges()) {
        this.navLinks = this.facultyLinks;
      } else {
        this.navLinks = this.studentLinks;
      }
    });
  }

  toggleViewMode(): void {
    this.viewModeService.toggleViewMode();
  }

  private setNavLinks(): void {
    this.navLinks = this.viewModeService.getViewMode()
      ? this.studentLinks
      : this.adminLinks;
  }
}
