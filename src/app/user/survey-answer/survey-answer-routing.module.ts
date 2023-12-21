import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyAnswerComponent } from './survey-answer.component';

const routes: Routes = [
  { 
    path: '', 
    component: SurveyAnswerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyAnswerRoutingModule { }
