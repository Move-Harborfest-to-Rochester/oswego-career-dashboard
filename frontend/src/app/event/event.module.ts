import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from './event-list/event-list.component';
import { EventListItemComponent } from './event-list-item/event-list-item.component';



@NgModule({
  declarations: [
    EventListComponent,
    EventListItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EventListComponent
  ]
})
export class EventModule { }
