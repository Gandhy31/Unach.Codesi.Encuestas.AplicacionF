import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyAnswerRoutingModule } from './survey-answer-routing.module';
import { SurveyAnswerComponent } from './survey-answer.component';
import { SurveyModule } from "survey-angular-ui";

@NgModule({
  declarations: [
    SurveyAnswerComponent
  ],
  imports: [
    CommonModule,
    SurveyAnswerRoutingModule,
    SurveyModule
  ]
})
export class SurveyAnswerModule { }
