import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyEditorRoutingModule } from './survey-editor-routing.module';
import { SurveyEditorComponent } from './survey-editor.component';
import { SurveyCreatorModule } from 'survey-creator-angular';


@NgModule({
  declarations: [
    SurveyEditorComponent
  ],
  imports: [
    CommonModule,
    SurveyEditorRoutingModule, 
    SurveyCreatorModule
  ]
})
export class SurveyEditorModule { }
