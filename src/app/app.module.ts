import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { SchedulePickupComponent } from './schedule-pickup/schedule-pickup.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { BroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { PickupHistoryComponent } from './pickup-history/pickup-history.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { GenerateReportAdminComponent } from './generate-report-admin/generate-report-admin.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ViewProfileAdminComponent } from './view-profile-admin/view-profile-admin.component';
import { ViewProfileUserComponent } from './view-profile-user/view-profile-user.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { CommunityDashboardModule } from './community-dashboard/community-dashboard.module';
import { AdminDashboardRoutingModule } from './admin-dashboard/admin-dashboard-routing.module';
import { CommunityDashboardRoutingModule } from './community-dashboard/community-dashboard-routing.module';
import { AdminRegistrationComponent } from './register/admin-registration/admin-registration.component';
import { UserRegistrationComponent } from './register/user-registration/user-registration.component';
import { ViewIssueComponent } from './view-issue/view-issue.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CommunityDashboardComponent } from './community-dashboard/community-dashboard.component';
import { GenerateReportUserComponent } from './generate-report-user/generate-report-user.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login page
];

@NgModule({
  declarations: [
    AppComponent,
    SchedulePickupComponent,
    NotificationListComponent,
    BroadcastMessageComponent, 
    PickupHistoryComponent, 
    ReportIssueComponent, 
    GenerateReportAdminComponent,
    ViewProfileAdminComponent,
    ViewProfileUserComponent,
    ViewIssueComponent,
    AdminRegistrationComponent,
    UserRegistrationComponent,
    ForgotPasswordComponent,
    LoginComponent,
    CreateCommunityComponent,
    GenerateReportUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminDashboardRoutingModule,
    CommunityDashboardRoutingModule,
    AdminDashboardModule,
    CommunityDashboardModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSnackBarModule,
    NgChartsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    ),
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
