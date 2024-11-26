import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityDashboardComponent } from './community-dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CommunityDashboardComponent
],
  imports: [
    CommonModule, 
    FormsModule,
    RouterModule
],
})
export class CommunityDashboardModule {}
