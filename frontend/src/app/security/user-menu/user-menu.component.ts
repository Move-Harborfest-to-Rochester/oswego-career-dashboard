import {Component, OnInit, DestroyRef, inject} from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../domain/user';
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserService} from "../user.service";
import {ScreenSizeService} from "../../util/screen-size.service";
import {map, Observable} from "rxjs";
import { ViewModeService } from '../../util/view-mode.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.less']
})
export class UserMenuComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  user: User = User.makeEmpty();
  profileURL: string | null = null;
  displayName$: Observable<boolean>;
  isStudentView = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly screenSizeSvc: ScreenSizeService,
    public readonly viewModeService: ViewModeService
  ) {
    this.displayName$ = this.screenSizeSvc.screenSize$.pipe(
      map(size => size > 830)
    );
  }

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        if (user) this.user = user;
      });

    this.viewModeService.isStudentView$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(view => this.isStudentView = view);
  }

  logout() {
    this.authService.signOut();
  }

  openSettings() {
    this.router.navigate(['/settings'])
      .then(success => {
        if (!success) {
          console.error('Navigation to settings failed')
        }
      });
  }
  toggleViewMode(): void {
    this.viewModeService.toggleViewMode();
  }
}
