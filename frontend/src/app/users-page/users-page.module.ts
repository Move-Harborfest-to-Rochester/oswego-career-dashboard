import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {UsersPageComponent} from './users-page.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {EditRoleMenuModule} from './edit-role-menu/edit-role-menu.module';
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {EditYearMenuComponent} from './edit-year-menu/edit-year-menu.component';
import {
  EditYearConfirmationDialogComponent
} from './edit-year-menu/edit-year-confirmation-dialog/edit-year-confirmation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    UsersPageComponent,
    EditYearMenuComponent,
    EditYearConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NgOptimizedImage,
    RouterLink,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    EditRoleMenuModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule
  ],
})
export class UsersPageModule {
}
