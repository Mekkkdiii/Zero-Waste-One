import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityDashboardComponent } from './community-dashboard.component';
import { SchedulePickupComponent } from '../schedule-pickup/schedule-pickup.component';
import { NotificationListComponent } from '../notification-list/notification-list.component';
import { ReportIssueComponent } from '../report-issue/report-issue.component';
import { PickupHistoryComponent } from '../pickup-history/pickup-history.component';
import { GenerateReportComponent } from '../generate-report/generate-report.component';
import { ViewProfileComponent } from '../view-profile/view-profile.component';

const routes: Routes = [
    {
      path: '',
      component: CommunityDashboardComponent,
      children: [
        { path: '', redirectTo: 'schedule-pickup', pathMatch: 'full' }, // Default child route
        { path: 'schedule-pickup', component: SchedulePickupComponent },
        { path: 'pickup-history', component: PickupHistoryComponent },
        { path: 'report-issue', component: ReportIssueComponent },
        { path: 'notifications', component: NotificationListComponent },
        { path: 'generate-report', component: GenerateReportComponent },
        { path: 'view-profile', component: ViewProfileComponent },
      ],
    },
];  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityDashboardRoutingModule {}
