import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { OswegoLogoModule } from '../oswego-logo/oswego-logo.module';
import { LogoLinkComponent } from './logo-link.component';

@NgModule({
  declarations: [LogoLinkComponent],
  imports: [CommonModule, OswegoLogoModule, MatDividerModule],
  exports: [LogoLinkComponent],
})
export class LogoLinkModule {}
