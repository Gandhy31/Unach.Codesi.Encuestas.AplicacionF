import { Component } from '@angular/core';

import { Model, StylesManager } from "survey-core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from "rxjs";
import { EncuestaService } from "src/app/services/encuesta/encuesta.service";
import { Resultado } from "src/app/models/resultado.model";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-answer',
  templateUrl: './survey-answer.component.html',
  styleUrls: ['./survey-answer.component.css']
})
export class SurveyAnswerComponent {
  idEncuesta: any;
  idUsuario: any;
  title = "Encuesta de prueba";
  survey = new Model();
  surveyModel: Model = this.survey;
  vectorUsuarios: any[] = [];
  resultadoUsuario: any;

  constructor(private http: HttpClient, private _serviceEncuesta: EncuestaService, private route: ActivatedRoute) { }

  async ngOnInit() {
    this.idEncuesta = this.route.snapshot.paramMap.get('idE');
    this.idUsuario = this.route.snapshot.paramMap.get('idU');
    this.resultadoUsuario = await this.ObtenerResultadoUsuario(this.idEncuesta, this.idUsuario);
    if(this.resultadoUsuario == true){
      console.log("Encuesta respondida");
    }
    const encuesta = await this.ObtenerEncuesta(this.idEncuesta);
    const survey = new Model(encuesta.valoresEncuesta);
    
    this.surveyModel = survey;
    survey.onComplete.add((sender, options) => {
       this.AgregarResultado(sender.data, this.idEncuesta, this.idUsuario);
  });;
    
  }
  async ObtenerEncuesta(id: number) {
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerEncuesta(id)
      );
      return(response.entidad);
    } catch (e: HttpErrorResponse | any) {
    }
  }

  async AgregarResultado(body: any, id: number, idU: number) {
    const resultado = new Resultado(id, idU,  JSON.stringify(body));
    console.log(resultado);
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.AgregarResultado(resultado)
      );
      console.log(response);
    } catch (e: HttpErrorResponse | any) {
    }
  }

  async ObtenerUsuario(id: number){
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerUsuario(id)
      );
    } catch (e: HttpErrorResponse | any) {
    }
  }

  async ObtenerUsuarios(){
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerUsuarios()
      );
    } catch (e: HttpErrorResponse | any) {
    }
  }

  async ObtenerResultadoUsuario(idE: number, idU: number){
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerResultadoUsuario(idE, idU)
      );
      return(response.entidad);
    } catch (e: HttpErrorResponse | any) {
    }
  }
}
