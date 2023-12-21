import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'encuesta-usuario/:idE/:idU',
    pathMatch: 'full' 
  },
  { 
    path: 'encuesta-usuario/:idE/:idU', 
    loadChildren: () => import('./survey-answer/survey-answer.module').then(m => m.SurveyAnswerModule) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
