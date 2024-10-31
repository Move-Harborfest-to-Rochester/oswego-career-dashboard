import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotlinkComponent } from './hotlink.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    HotlinkComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
  ],
  exports: [
    HotlinkComponent
  ]
})
export class HotlinkModule { }
