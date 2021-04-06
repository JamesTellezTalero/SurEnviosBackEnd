import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class ServicioModel
{
    @jsonMember
    id: number;

    @jsonMember
    direccionOrigen: string;

    @jsonMember
    direccionDestino: string;

    @jsonMember
    descripcionCarga: string;

    @jsonMember
    fechaSolicitud: Date;

    @jsonMember
    valor: number;

    @jsonMember
    estadoServicio: number;

    @jsonMember
    idCliente: number;

    @jsonMember
    idCiudadOrigen: number;

    @jsonMember
    idCiudadDestino: number;

    @jsonMember
    idTipoVehiculo: number;

    @jsonMember
    idUsuario?:number;

    @jsonMember
    latOrigen:number;

    @jsonMember
    lonOrigen:number;

    @jsonMember
    latDest:number;
    
    @jsonMember
    lonDest:number;

    @jsonMember
    idTipoServicio: number;
}