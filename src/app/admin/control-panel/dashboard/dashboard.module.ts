import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SurveyModule } from "survey-angular-ui";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SurveyModule,
    HttpClientModule,
    CdkAccordionModule,
    MatExpansionModule,
    MatTabsModule,
    NgbScrollSpyModule,
    CanvasJSAngularChartsModule
  ]
})
export class DashboardModule { }
