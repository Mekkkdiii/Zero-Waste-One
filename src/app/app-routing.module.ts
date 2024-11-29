import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRegistrationComponent } from './register/admin-registration/admin-registration.component';
import { UserRegistrationComponent } from './register/user-registration/user-registration.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CommunityDashboardComponent } from './community-dashboard/community-dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { GenerateReportAdminComponent } from './generate-report-admin/generate-report-admin.component';
import { GenerateReportUserComponent } from './generate-report-user/generate-report-user.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { PickupHistoryComponent } from './pickup-history/pickup-history.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { SchedulePickupComponent } from './schedule-pickup/schedule-pickup.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-register', component: AdminRegistrationComponent },
  { path: 'create-community', component: CreateCommunityComponent},
  { path: 'user-register', component: UserRegistrationComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'community-dashboard', component: CommunityDashboardComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'broadcast', component: BroadcastMessageComponent },
  { path: 'generate-report-admin', component: GenerateReportAdminComponent },
  { path: 'generate-report-user', component: GenerateReportUserComponent },
  { path: 'notifications', component: NotificationListComponent },
  { path: 'pickup-history', component: PickupHistoryComponent },
  { path: 'report-issue', component: ReportIssueComponent },
  { path: 'schedule-pickup', component: SchedulePickupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
