import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PortfolioComponent } from "./portfolio/portfolio.component";
import { ApiDocumentationsComponent } from "./api-documentations/api-documentations.component";
import { LoginPageComponent } from './security/login-page/login-page.component';
import {adminRoleGuard, authGuard, facultyRoleGuard, noAuthGuard, signedUpGuard} from './security/auth-guard';
import { MilestoneEditComponent } from './admin/milestone-edit/milestone-edit.component';
import { MilestoneMainPageComponent } from './admin/milestone-main-page/milestone-main-page.component';
import { TaskMainPageComponent } from './admin/task-main-page/task-main-page.component';
import {UsersPageComponent} from "./users-page/users-page.component";
import { SignupPageComponent } from './security/signup-page/signup-page.component';
import { EventMainPageComponent } from './admin/event-main-page/event-main-page.component';
import {SettingsPageComponent} from "./settings/settings-page.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import { MilestonesComponent } from './milestones-page/milestones/milestones.component';
import { MilestonesFacultyComponent } from './milestones-page/milestones-faculty/milestones-faculty.component';
import { AnalyticsDashboardComponent } from './admin/analytics-dashboard/analytics-dashboard.component';
import {EditBasacFacultyComponent} from "./admin/edit-basac-faculty/edit-basac-faculty.component";
import {EventsPageComponent} from "./events-page/events-page.component";

const studentRoutes: Routes = [
  {path: '', component: HomepageComponent, canActivate: [authGuard]},
  {path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard]},
  {path: 'settings', component: SettingsPageComponent, canActivate: [authGuard]},
  {path: 'milestones', component: MilestonesComponent, canActivate: [authGuard]},
  {path: 'events/:id', component: EventsPageComponent, canActivate: [authGuard]},
]

const facultyRoutes: Routes = [
  {path: 'faculty/users', component: UsersPageComponent, canActivate: [authGuard, facultyRoleGuard]},
  {path: 'faculty/portfolio', component: PortfolioComponent, canActivate: [authGuard, facultyRoleGuard]},
  {path: 'faculty/portfolio/:id', component: PortfolioComponent, canActivate: [authGuard, facultyRoleGuard]},
  {path: 'faculty/milestones/:id', component: MilestonesFacultyComponent, canActivate: [authGuard, facultyRoleGuard]},
]

const adminRoutes: Routes = [
  {path: 'admin', redirectTo: '/admin/milestones', pathMatch: 'full'},  //TODO: admin home page
  {path: 'admin/milestones', component: MilestoneMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/milestone-edit/:name', component: MilestoneEditComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/tasks', component: TaskMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/events', component: EventMainPageComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/edit-basac-faculty', component: EditBasacFacultyComponent, canActivate: [authGuard, adminRoleGuard]},
  {path: 'admin/analytics', component: AnalyticsDashboardComponent, canActivate: [authGuard, adminRoleGuard]},
]

const routes: Routes = [
  ...studentRoutes,
  ...facultyRoutes,
  ...adminRoutes,
  {path: 'login', component: LoginPageComponent, canActivate: [noAuthGuard]},
  {path: 'signup', component: SignupPageComponent, canActivate: [signedUpGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'swagger', component: ApiDocumentationsComponent, canActivate: [authGuard, adminRoleGuard]},


  // This must be at button to catch all not defined
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
