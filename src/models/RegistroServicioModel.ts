import { jsonMember, jsonObject } from "typedjson";

@jsonObject 
export class RegistroServicioModel
{
    @jsonMember
    id: number;
  
    @jsonMember
    fechaRegistro: Date;
  
    @jsonMember
    observacion: string;
  
    @jsonMember
    idServicio: number;
  
    @jsonMember
    idEstadoServicio: number;
}