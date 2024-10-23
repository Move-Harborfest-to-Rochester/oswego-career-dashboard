import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('facebook', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));
    this.matIconRegistry.addSvgIcon('instagram', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg'));
    this.matIconRegistry.addSvgIcon('twitter', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg'));
    this.matIconRegistry.addSvgIcon('youtube', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/youtube.svg'));
  }
}
