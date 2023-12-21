import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { ControlPanelComponent } from './control-panel.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ControlPanelComponent
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ControlPanelModule { }
