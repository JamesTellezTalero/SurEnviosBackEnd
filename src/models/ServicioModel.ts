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
    idTipoCamion: number;
}