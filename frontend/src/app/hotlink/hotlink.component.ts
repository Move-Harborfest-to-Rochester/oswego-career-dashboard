import { Component, Input } from '@angular/core';

@Component({
  selector: 'hotlink',
  templateUrl: './hotlink.component.html',
  styleUrls: ['./hotlink.component.less']
})
export class HotlinkComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
}
