import { Injectable } from '@angular/core';
import { Request } from '../common/request';
import { EntidadRespuesta } from '../common/ResponseEntity';

@Injectable({
  providedIn: 'root'
})


export class EncuestaService {

  constructor(private request:Request) { }

  ObtenerEncuesta(id: number) {

    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Encuestas/ObtenerEncuesta/${id}`);

  }

  ObtenerEncuestas() {

    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Encuestas/ObtenerEncuestas`);

  }

  AgregarEncuesta(body: any) {

    return this.request.ejecutarQueryPost<EntidadRespuesta>(`Encuestas/AgregarEncuesta`, body);

  }

  ActualizarEncuesta(body: any) {

    return this.request.ejecutarQueryPut<EntidadRespuesta>(`Encuestas/ActualizarEncuesta`, body);

  }

  EliminarEncuesta(id: number) {

    return this.request.ejecutarQueryDelete<EntidadRespuesta>(`Encuestas/EliminarEncuesta/${id}`);

  }

  ObtenerResultados() {

    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Resultados/ObtenerResultados`);

  }

  ObtenerListaResultados(id: number) {

    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Resultados/ObtenerListaResultados/${id}`);

  }

  AgregarResultado(body: any) {

    return this.request.ejecutarQueryPost<EntidadRespuesta>(`Resultados/AgregarResultado`, body);

  }

  ObtenerResultado(id: number) {

    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Resultados/ObtenerResultado/${id}`);

  }

  ActualizarResultado(id: number, body: any) {

    return this.request.ejecutarQueryPut<EntidadRespuesta>(`Resultados/ActualizarResultado/`, body);

  }

  ObtenerUsuarios(){
    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Usuarios/ObtenerUsuarios`);
  }

  ObtenerUsuario(id: number){
    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Usuarios/ObtenerUsuario/${id}`);
  }

  ObtenerResultadoUsuario(idE: number, idU: number){
    return this.request.ejecutarQueryGet<EntidadRespuesta>(`Resultados/ObtenerResultadoUsuario/${idE}/${idU}`);
  }

}

 