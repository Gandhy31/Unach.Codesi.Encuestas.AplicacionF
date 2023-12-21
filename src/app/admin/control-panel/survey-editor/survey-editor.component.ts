import { Component, OnInit } from '@angular/core';
import { SurveyCreatorModel } from "survey-creator-core";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import { localization } from "survey-creator-core";
import { Encuesta } from "src/app/models/encuesta.model";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from "rxjs";
import { EncuestaService } from "src/app/services/encuesta/encuesta.service";
import { ActivatedRoute } from '@angular/router';

localization.currentLocale = "es"; 

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: false,
  locale: "es",
  questionTypes: ["text", "checkbox", "radiogroup", "dropdown", "boolean", "ranking", "text", "comment", "matrix", "html", "image"]
};

@Component({
  selector: 'app-survey-editor',
  templateUrl: './survey-editor.component.html',
  styleUrls: ['./survey-editor.component.css']
})

export class SurveyEditorComponent implements OnInit {

  idEncuesta: any;
  //survey = new SurveyCreatorModel(creatorOptions);
  surveyCreatorModel!: SurveyCreatorModel;
  constructor(private _serviceEncuesta: EncuestaService, private route: ActivatedRoute) { }
  async  ngOnInit() {
    this.idEncuesta = this.route.snapshot.paramMap.get('id');
    const valor = await this.ObtenerEncuesta(this.idEncuesta);
    const creator = new SurveyCreatorModel(creatorOptions);
    //console.log(valor.valoresEncuesta);
    creator.text = valor.valoresEncuesta;
    creator.saveSurveyFunc = () => { 
      var cadenajson = JSON.stringify(creator.JSON);
      var encuesta = new Encuesta(valor.id, valor.nombre, valor.activo, valor.periodo, valor.dependencia,  valor.fechaInicio, valor.fechaFin,  cadenajson);
      this.ActualizarEncuesta(encuesta);
    };
    this.surveyCreatorModel = creator;
  }

  async ObtenerEncuesta(id: number) {
    debugger
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerEncuesta(id)
      );
      return(response.entidad);
    } catch (e: HttpErrorResponse | any) {
      console.log(e);
    }
  }

  async ActualizarEncuesta(body: any) {
    debugger
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ActualizarEncuesta(body)
      );
      console.log(response);
    } catch (e: HttpErrorResponse | any) {
      console.log(e);
    }
  }
}
