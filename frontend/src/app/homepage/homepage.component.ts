import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../security/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Role, User } from '../security/domain/user';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  showHotlinks: boolean = false;

  constructor(
    public readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.user$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((user: User | null) => {
      this.showHotlinks = (user?.role == Role.Student);
    });
  }
}
