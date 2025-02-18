import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'logo-link',
  templateUrl: './logo-link.component.html',
  styleUrls: ['./logo-link.component.less'],
})
export class LogoLinkComponent {
  @Input() showTitle: boolean = false;

  constructor(private readonly router: Router) {}

  onClick() {
    this.router.navigate(['/']);
  }
}
