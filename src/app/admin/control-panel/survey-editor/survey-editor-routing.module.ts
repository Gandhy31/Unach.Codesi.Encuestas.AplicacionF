import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyEditorComponent } from './survey-editor.component';

const routes: Routes = [
  {
    path: '', 
    component: SurveyEditorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyEditorRoutingModule { }
