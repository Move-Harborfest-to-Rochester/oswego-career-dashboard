import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from './event-list/event-list.component';



@NgModule({
  declarations: [
    EventListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EventListComponent
  ]
})
export class EventModule { }
