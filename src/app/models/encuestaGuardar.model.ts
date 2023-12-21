export  class EncuestaG {
    constructor(
      public nombre: string,
      public activo: boolean,
      public periodo: string,
      public dependencia: string,
      public fechaInicio: string,
      public fechaFin: string,
      public valoresEncuesta: string
    ) {
  }
}