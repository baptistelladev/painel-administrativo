import { NgModule } from '@angular/core';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
