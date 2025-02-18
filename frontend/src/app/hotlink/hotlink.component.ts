import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hotlink',
  templateUrl: './hotlink.component.html',
  styleUrls: ['./hotlink.component.less']
})
export class HotlinkComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() link: string = '';
  @Input() fragment?: string;

  constructor(private readonly router: Router) {
  }

  navigate() {
    this.router.navigate([this.link], {
      fragment: this.fragment,
    });
  }
}
