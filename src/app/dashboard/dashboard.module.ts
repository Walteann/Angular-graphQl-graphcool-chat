import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardResourcesComponent } from './components/dashboard-resources/dashboard-resources.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardHeaderComponent,
    DashboardHomeComponent,
    DashboardResourcesComponent
  ]
})
export class DashboardModule { }
