import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CreateCommunityComponent } from '../create-community/create-community.component';
import { BroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';
import { GenerateReportComponent } from '../generate-report/generate-report.component';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { ViewIssueComponent } from '../view-issue/view-issue.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
        { path: 'create-community', component: CreateCommunityComponent },
        { path: 'broadcast', component: BroadcastMessageComponent },
        { path: 'generate-report', component: GenerateReportComponent },
        { path: 'view-profile', component: ViewProfileComponent },
        { path: 'view-issue', component: ViewIssueComponent},
        { path: '', redirectTo: 'view-profile', pathMatch: 'full' }, // Default child route
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
