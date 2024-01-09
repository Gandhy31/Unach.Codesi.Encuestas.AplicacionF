import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';
import { lastValueFrom } from 'rxjs';
import * as _ from 'lodash';
import { Model } from "survey-core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta.model';
import { utils, writeFileXLSX } from 'xlsx';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  encuesta = new Encuesta(0, '', true, '', '', '' ,'', '') ;
  reporteExcel = utils.book_new();
  vectorTipoGrafico = [
    {
      nombre: 'Dona (Porcentajes)',
      valor: 'doughnut'
    },
    {
      nombre: 'Pastel (Porcentajes)',
      valor: 'pie'
    },
    {
      nombre: 'Barras',
      valor: 'bar'
    },
    {
      nombre: 'Area',
      valor: 'area'
    },
    {
      nombre: 'Columnas',
      valor: 'column'
    },
    {
      nombre: 'Líneas',
      valor: 'line'
    }
  ];

  idEncuesta: any;
  isLoading: boolean = true;
  resultados: any[] = [];
  preguntas: any[] = [];
  vectorSecciones: any[] = [];
  constructor(private http: HttpClient, private _serviceEncuesta: EncuestaService, private route: ActivatedRoute, private formService:FormBuilder, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.idEncuesta = this.route.snapshot.paramMap.get('id');
    this.encuesta = await this.ObtenerEncuesta(this.idEncuesta);
    const survey = new Model(this.encuesta.valoresEncuesta);
    const listaResultados = await this.ObtenerListaResultados(this.idEncuesta);

    if(!(listaResultados.length == 0)){
      listaResultados.forEach((resultado: any)=>{
        this.resultados.push(JSON.parse(resultado.valorResultado));
      });
  
      this.preguntas = Object.keys(this.resultados[0]);
      var secciones = survey.pages;
      
  
      for(let seccion of secciones){
        var seccionAgregar = {
          nombre: seccion.title,
          listaPreguntas: this.ObtenerPreguntas(seccion.getQuestions(true)),
          excel: null
        }
        console.log(seccion.getQuestions(true))
        this.vectorSecciones.push(seccionAgregar);
      };
  
      console.log(secciones);
      console.log(this.resultados)
      var arr1!: any [];
      var listaExcel :any [][] = [];
      var vectorMatriz: any [];
      var vectorFinal: any [] = [];
      var vectorHojas: any [] = [];
  
      for (let i = 0; i < this.vectorSecciones.length; i++) {
        for (let j = 0; j < this.vectorSecciones[i].listaPreguntas.length; j++) {
          arr1 = [];
          if(this.vectorSecciones[i].listaPreguntas[j].tipo == "matrix"){
            this.vectorSecciones[i].listaPreguntas[j].filas.forEach((fila: string)=>{
              vectorMatriz = [];
              this.resultados.forEach((resultado: any) =>{
                vectorMatriz.push(resultado[this.vectorSecciones[i].listaPreguntas[j].nombre][fila]);
              })
              var respuestasPorPregunta = _.countBy(vectorMatriz);
              const data = Object.keys(respuestasPorPregunta).map(key => {
                return {
                  label: key.replace(/\s+/g, ''), // Elimina espacios en el nombre del item
                  y: respuestasPorPregunta[key] 
                };
              });
              vectorFinal.push({
                fila: fila,
                valores: vectorMatriz,
                conteo: respuestasPorPregunta, 
                opcionesGrafico: {
                  exportEnabled: true,
                  title:{
                    text: fila,
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold", 
                    fontSize: 25
                  },
                  animationEnabled: true,
                  axisY: {
                    includeZero: true,
                  },
                  data: [{
                    type: "doughnut",
                    indexLabel: "{label}: {y} (#percent%)",
                    dataPoints: data,
                    showInLegend: true,
                    legendText:"{label}"
                  }]
                },
                chart: null
              })
              vectorHojas.push({valor: fila, ...respuestasPorPregunta});
            })
            this.vectorSecciones[i].listaPreguntas[j].respuestas = vectorFinal;
            this.CrearHoja(vectorHojas, this.vectorSecciones[i].listaPreguntas[j].nombre);
          }else{
            this.resultados.forEach((resultado: any)=>{
              
              if(!(resultado[this.vectorSecciones[i].listaPreguntas[j].nombre] == null)){
                if(Array.isArray(resultado[this.vectorSecciones[i].listaPreguntas[j].nombre])){
                  arr1.push(...resultado[this.vectorSecciones[i].listaPreguntas[j].nombre].map((item: string) => (item == 'none' ? 'Ninguno' : item)));
                }else{
                  arr1.push(resultado[this.vectorSecciones[i].listaPreguntas[j].nombre]);
                }
              }
              
            })
            
            var respuestasPorPregunta = _.countBy(arr1);
            var hojaExcel = [respuestasPorPregunta];
            
            const data = Object.keys(respuestasPorPregunta).map(key => {
              return {
                label: key.replace(/\s+/g, ''), // Elimina espacios en el nombre del item
                y: respuestasPorPregunta[key] 
              };
            });
  
            var configGrafico = {
              exportEnabled: true,
              title:{
                text: this.vectorSecciones[i].listaPreguntas[j].nombre,
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold", 
                fontSize: 25
              },
              animationEnabled: true,
              axisY: {
                includeZero: true,
              },
              data: [{
                type: "doughnut",
                indexLabel: "{label}: {y} (#percent%)",
                dataPoints: data,
                showInLegend: true,
                legendText:"{label}"
              }]
            };
            this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico = configGrafico;
            this.vectorSecciones[i].listaPreguntas[j].respuestas = arr1;
            
            if(this.vectorSecciones[i].listaPreguntas[j].tipo == "text"){
              var listaTexto = arr1.map(str => ({ texto: str }));
              this.CrearHoja(listaTexto, this.vectorSecciones[i].listaPreguntas[j].nombre);
            }else if(this.vectorSecciones[i].listaPreguntas[j].tipo == "comment"){
              var listaComentario = arr1.map(str => ({ comentario: str }));
              this.CrearHoja(listaComentario, this.vectorSecciones[i].listaPreguntas[j].nombre);
            }else{
              this.CrearHoja(hojaExcel, this.vectorSecciones[i].listaPreguntas[j].nombre);
            }
          }
        }
        this.vectorSecciones[i].excel = listaExcel
      }
  
      console.log(this.vectorSecciones);
    }
    
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

  async ObtenerListaResultados(id: number) {
      try {
        let response = await lastValueFrom(
          this._serviceEncuesta.ObtenerListaResultados(id)
        );
        this.isLoading = false;
        return(response.entidad);
      } catch (e: HttpErrorResponse | any) {
        console.log(e);
        this.isLoading = false;
      }
  }

  ContarElementos(lista: any){
    const contador : any = []; 
    for (let i = 0; i < lista.length; i++) {
      const elemento = lista[i];
      if (contador[elemento]) {
        contador[elemento]++;
      } else {
        contador[elemento] = 1;
      }
    }
    return contador;
  }

  //funciones de los graficos

  getChartInstance2(chart: object, i: number, j: number, k:number) {
    this.vectorSecciones[i].listaPreguntas[j].respuestas[k].chart = chart;
  }

  getChartInstance(chart: object, i: number, j: number) {
    this.vectorSecciones[i].listaPreguntas[j].chart = chart;
  }

  CambiarGrafico(i: number, j: number, elemento:any){
    this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico.data[0].type = elemento.target.value;
    if(elemento.target.value == 'pie'|| elemento.target.value =='doughnut' ){
      this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico.data[0].indexLabel="{label}: {y} (#percent%)";
      this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico.data[0].showInLegend=true;
    }else{
      this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico.data[0].indexLabel = "{label}: {y}";
      this.vectorSecciones[i].listaPreguntas[j].opcionesGrafico.data[0].showInLegend = false;
    }
    this.vectorSecciones[i].listaPreguntas[j].chart.render();
  }

  CambiarGrafico2(i: number, j: number, k:number, elemento:any){
    this.vectorSecciones[i].listaPreguntas[j].respuestas[k].opcionesGrafico.data[0].type = elemento.target.value;
    if(elemento.target.value == 'pie'|| elemento.target.value =='doughnut' ){
      this.vectorSecciones[i].listaPreguntas[j].respuestas[k].opcionesGrafico.data[0].indexLabel="{label}: {y} (#percent%)";
      this.vectorSecciones[i].listaPreguntas[j].respuestas[k].opcionesGrafico.data[0].showInLegend=true;
    }else{
      this.vectorSecciones[i].listaPreguntas[j].respuestas[k].opcionesGrafico.data[0].indexLabel = "{label}: {y}";
      this.vectorSecciones[i].listaPreguntas[j].respuestas[k].opcionesGrafico.data[0].showInLegend = false;
    }
    this.vectorSecciones[i].listaPreguntas[j].respuestas[k].chart.render();
  }

  //Funciones preguntas

  ObtenerPreguntas(preguntas: any){
    var listaPreguntas: any[] = [];
    var preguntaAgregar;
    for(let pregunta of preguntas){
      if(pregunta.getType()=="matrix"){
        preguntaAgregar = {
          nombre: pregunta.getValueName(),
          tipo: pregunta.getType(),
          filas: pregunta.toJSON().rows,
          columnas: pregunta.toJSON().columns,
          respuestas: null
        }
        listaPreguntas.push(preguntaAgregar);
      }else{
        preguntaAgregar = {
          nombre: pregunta.getValueName(),
          tipo: pregunta.getType(),
          respuestas: null,
          opcionesGrafico: null,
          chart: null
        }
        listaPreguntas.push(preguntaAgregar);
      }
    }
    return listaPreguntas;
  }

  Expandir(index: number){
    if(index == 0){
      return true;
    }else{
      return false;
    }
  }

  GraficoGeneral(tipo: string){
    if(!(tipo == "text" || tipo == "comment" || tipo == "matrix")){
      return true
    }else{
      return false
    }
  }
  GraficoTexto(tipo: string){
    if(tipo == "text" || tipo == "comment"){
      return true
    }else{
      return false
    }
  }

  GraficoMatriz(tipo: string){
    if(tipo == "matrix"){
      return true
    }else{
      return false
    }
  }

  ExportarExcel(){
    writeFileXLSX(this.reporteExcel, this.encuesta.nombre + ".xlsx");
  }

  CrearHoja(base: any, pregunta: string){
    var ws = utils.json_to_sheet(base);
    utils.book_append_sheet(this.reporteExcel, ws, pregunta);
  }

  /*DescargarPDF(elemento: any){
    const Pagina = document.documentElement;
    const element = document.getElementById(elemento);
    if (!element) {
      console.error('El elemento con el ID proporcionado no fue encontrado.');
      return;
    }
    html2canvas(Pagina,{
      // Ajusta el área de captura al tamaño total de la página
      width: Pagina.scrollWidth,
      height: Pagina.scrollHeight,
      x: window.scrollX,
      y: window.scrollY,
      scrollX: 0,
      scrollY: 0,
    }).then(canvas => {
      const contenido = canvas.toDataURL('image/png');
      // Crea un objeto PDF
      const pdf = new jsPDF();
      var width = pdf.internal.pageSize.getWidth();
      var height = (canvas.height * width) / canvas.width;

      // Agrega la imagen al PDF
      pdf.addImage(contenido, 'PNG', 0, 0, width, height);

      // Guarda o descarga el PDF
      pdf.save('documento.pdf');


    })
  }*/
}
