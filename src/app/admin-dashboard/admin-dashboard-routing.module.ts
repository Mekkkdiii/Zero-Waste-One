import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CreateCommunityComponent } from '../create-community/create-community.component';
import { BroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';
import { GenerateReportAdminComponent } from '../generate-report-admin/generate-report-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
        { path: 'create-community', component: CreateCommunityComponent },
        { path: 'broadcast', component: BroadcastMessageComponent },
        { path: 'generate-report-admin', component: GenerateReportAdminComponent },
        { path: '', redirectTo: 'view-profile-admin', pathMatch: 'full' }, // Default child route
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
