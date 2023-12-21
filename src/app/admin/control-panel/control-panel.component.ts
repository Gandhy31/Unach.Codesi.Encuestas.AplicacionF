import { Component, OnInit } from '@angular/core';
import { EncuestaService } from 'src/app/services/encuesta/encuesta.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, NgbDropdownModule,ModalDismissReasons, NgbDatepickerModule, NgbAlertModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EncuestaG } from 'src/app/models/encuestaGuardar.model';
import { Encuesta } from 'src/app/models/encuesta.model';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {
  form!: FormGroup;
  closeResult = '';
  nuevaEncuestaD = new EncuestaG( '', true, '', '', '' ,'', '');
  encuestaE = new Encuesta(0, '', true, '', '', '' ,'', '') ;
  encuestas: any;
  idE: number = 0;
  dependencias: string[] = ['Academia', 'Investigación', 'Vinculación'];
  vectorFacultades: any[] = [
    {
      facultad: 'Facultad de Ingeniería', 
      carreras: [
        'Arquitectura', 'Agroindustria', 'Ingeniería Ambiental', 'Ingeniería Civil',
        'Ingeniería Industrial', 'Ingeniería en Tecnologías de la Información', 'Ingeniería en Telecomunicaciones', 'Todas'
      ]
    },
    {
      facultad: 'Facultad de Salud',
      carreras:[
        'Medicina', 'Enfermería', 'Psicología Clínica', 'Odontología', 'Fisioterapia', 'Laboratorio Clínico', 'Todas'
      ]
    },
    {
      facultad: 'Facultad de Ciencias Políticas y Administrativas ', 
      carreras:[
        'Economía', 'Derecho', 'Comunicación', 'Turismo','Contabilidad y Auditoría', 'Administración de Empresas', 'Todas'
      ]
    },
    {
      facultad: 'Facultad de Ciencias de la Educación, Humanas y Tecnologías', 
      carreras:[
        'Diseño Gráfico', 'Educación Inicial', 'Psicopedagogía', 'Educación Básica', 'Pedagogía de la Actividad Física y el Deporte', 
        'Pedagogía de los Idiomas Nacionales y Extranjeros', 'Pedagogía de la Lengua y la Literatura', 'Pedagogía de las Artes y Humanidades',
        'Pedagogía de la Historia y las Ciencias Sociales','Pedagogía de la Informática', 'Pedagogía de la Química y Biología', 
        'Pedagogía de las Matemáticas y la Física', 'Todas'
      ]
    },
    {
      facultad: 'Todas', 
      carreras:['Todas']
    }
  ];

  vectorCarreras: any[] = [];

  vectorUsuarios: any[] = ['Estudiantes', 'Docentes', 'Todos'];


  constructor(private _serviceEncuesta: EncuestaService, private router: Router, private modalService: NgbModal, private formService:FormBuilder) { 
    
    
  }
  async ngOnInit() {
    this.encuestas = await this.ObtenerEncuestas();
    console.log(this.vectorFacultades);
  }

  //funciones de validacion formulario get
  get NombreInvalido(){
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched
  }

  get PeriodoInvalido(){
    return this.form.get('periodo')?.invalid && this.form.get('periodo')?.touched
  }

  get DependenciaInvalida(){
    return this.form.get('dependencia')?.invalid && this.form.get('dependencia')?.touched
  }

  get fechaInicioInvalida(){
    return this.form.get('fechaInicio')?.invalid && this.form.get('fechaInicio')?.touched
  }

  get fechaFinInvalida(){
    return this.form.get('fechaFin')?.invalid && this.form.get('fechaFin')?.touched
  }

  //funcion validar fechas
  ValidarFecha(fecha: any){
    if(fecha<10){
      return ('0'+fecha);
    }else{
      return fecha;
    }
  }

  //funciones de formularios
  CrearFormulario(){
    this.form = this.formService.group({
      nombre:['', Validators.required],
      periodo:['', Validators.required],
      dependencia:['', Validators.required],
      facultad:['', Validators.required],
      carrera:['', Validators.required],
      usuario:['', Validators.required],
      fechaInicio:['', Validators.required],
      horaInicio:['', Validators.required],
      fechaFin:['', Validators.required],
      horaFin:['', Validators.required]
    })
  }

  FiltrarCarreras(valor: any){
    const carreras = this.vectorFacultades.find(carrera => carrera.facultad == valor);
    this.vectorCarreras = carreras.carreras;
    console.log(this.vectorCarreras);
  }


  async GuardarFormularioAgregar(modal: any){
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach(control=>
        {
          control.markAllAsTouched();
        })
    }else{
      var enc =  new EncuestaG(
        this.form.value.nombre,
        false,
        this.form.value.periodo,
        this.form.value.dependencia,
        this.form.value.fechaInicio.year + '-' +
        this.ValidarFecha(this.form.value.fechaInicio.month) + '-' +
        this.ValidarFecha(this.form.value.fechaInicio.day) + 'T' + this.form.value.horaInicio,
        this.form.value.fechaFin.year + '-' +
        this.ValidarFecha(this.form.value.fechaFin.month) + '-' +
        this.ValidarFecha(this.form.value.fechaFin.day) + 'T' + this.form.value.horaFin ,
        ''
      );
      await  this.AgregarEncuesta(enc);
      this.encuestas = await this.ObtenerEncuestas();
      console.log(enc);
      
      modal.close();
    }
  }

  async GuardarFormularioDuplicar(modal: any, body:any){
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach(control=>
        {
          control.markAllAsTouched();
        })
    }else{     
      body.nombre = this.form.value.nombre;
      body.periodo = this.form.value.periodo;
      body.dependencia = this.form.value.dependencia;
      body.fechaInicio = 
        this.form.value.fechaInicio.year + '-' + this.ValidarFecha(this.form.value.fechaInicio.month) + '-' +
        this.ValidarFecha(this.form.value.fechaInicio.day) + 'T' + this.form.value.horaInicio;
      body.fechaFin = 
        this.form.value.fechaFin.year + '-' +
        this.ValidarFecha(this.form.value.fechaFin.month) + '-' +
        this.ValidarFecha(this.form.value.fechaFin.day) + 'T' + this.form.value.horaFin;
      await this.AgregarEncuesta(body);
      this.encuestas = await this.ObtenerEncuestas();
      modal.close();
    }
  }

  async GuardarFormularioEditar(modal: any, body:any){
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach(control=>
        {
          control.markAllAsTouched();
        })
    }else{     
      body.nombre = this.form.value.nombre;
      body.periodo = this.form.value.periodo;
      body.dependencia = this.form.value.dependencia;
      body.fechaInicio = 
        this.form.value.fechaInicio.year + '-' + this.ValidarFecha(this.form.value.fechaInicio.month) + '-' +
        this.ValidarFecha(this.form.value.fechaInicio.day) + 'T' + this.form.value.horaInicio;
      body.fechaFin = 
        this.form.value.fechaFin.year + '-' +
        this.ValidarFecha(this.form.value.fechaFin.month) + '-' +
        this.ValidarFecha(this.form.value.fechaFin.day) + 'T' + this.form.value.horaFin;
      await this.ActualizarEncuesta(body);
      this.encuestas = await this.ObtenerEncuestas();
      modal.close();
    }
  }

  //funciones del web service
  async ObtenerEncuestas() {
    debugger
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.ObtenerEncuestas()
      );
      return(response.entidad);
    } catch (e: HttpErrorResponse | any) {
      console.log(e);
    }
  }

  async AgregarEncuesta(body: any){
    debugger
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.AgregarEncuesta(body)
      );
    } catch (e: HttpErrorResponse | any) {
      console.log(e);
    }
  }

  async EliminarEncuesta(id: number){
    debugger
    try {
      let response = await lastValueFrom(
        this._serviceEncuesta.EliminarEncuesta(id)
      );
    } catch (e: HttpErrorResponse | any) {
      console.log(e);
    }
    this.encuestas = await this.ObtenerEncuestas();
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

  

  //funciones de navegacion
  EditarEncuesta(encuesta: any): void{
    this.router.navigate(['/admin/paneladministrativo/editor/', encuesta.id])
  }

  ResponderEncuesta(encuesta: any): void{
    this.router.navigate(['/usuario/encuesta-usuario/', encuesta.id, 1])
  }

  ResultadosEncuesta(encuesta: any): void{
    this.router.navigate(['/admin/paneladministrativo/dashboard/', encuesta.id])
  }
  

  //Modales
  async AgregarEncuestaModal(content: any){
    this.CrearFormulario();
    this.modalService.open(content);
  }

  async EditarPropiedadesEncuestaModal(content: any, body: any){
    this.CrearFormulario();
    this.encuestaE.id = body.id;
    this.encuestaE.nombre = body.nombre;
    this.encuestaE.periodo = body.periodo;
    this.encuestaE.activo = body.activo;
    this.encuestaE.dependencia = body.dependencia;
    this.encuestaE.valoresEncuesta = body.valoresEncuesta;
    this.modalService.open(content);
  }

  async DuplicarEncuestaModal(content: any, body: any){
    this.CrearFormulario();
    this.nuevaEncuestaD.nombre = body.nombre;
    this.nuevaEncuestaD.periodo = body.periodo;
    this.nuevaEncuestaD.activo = false;
    this.nuevaEncuestaD.dependencia = body.dependencia;
    this.nuevaEncuestaD.valoresEncuesta = body.valoresEncuesta;
    this.modalService.open(content);
  }

  async EliminarEncuestaModal(content: any, body: any){
    this.idE = body.id;
    this.modalService.open(content);
  }

  async ActivarEncuesta(body: any) {
    body.activo = true
    console.log(body);
    await this.ActualizarEncuesta(body);
    this.encuestas = await this.ObtenerEncuestas();
  }
}
