import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {EventListComponent} from './event-list/event-list.component';
import {
  EventListItemComponent
} from './event-list-item/event-list-item.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatDividerModule} from "@angular/material/divider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    EventListComponent,
    EventListItemComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    RouterLink,
    MatDividerModule,
    MatPaginatorModule,
    PaginationModule,
    FormsModule
  ],
  exports: [
    EventListComponent
  ],
})
export class EventModule {
}
