import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlPanelComponent } from './control-panel.component';

const routes: Routes = [
  { 
    path: '', 
    component: ControlPanelComponent,
  },
  {
    path: 'dashboard/:id',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'editor/:id',
    loadChildren: () => import('./survey-editor/survey-editor.module').then(m => m.SurveyEditorModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
