import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'paneladministrativo',
    pathMatch: 'full' 
  },
  { 
    path: 'paneladministrativo', 
    loadChildren: () => import('./control-panel/control-panel.module').then(m => m.ControlPanelModule) 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
