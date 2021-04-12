import { jsonMember, jsonObject } from "typedjson";
import { Cliente } from "../entities/Cliente";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Municipio } from "../entities/Municipio";
import { TipoServicio } from "../entities/TipoServicio";
import { TipoVehiculo } from "../entities/TipoVehiculo";
import { Usuario } from "../entities/Usuario";

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
    estadoServicio: EstadoServicio;

    @jsonMember
    idCliente: Cliente;

    @jsonMember
    idCiudadOrigen: Municipio;

    @jsonMember
    idCiudadDestino: Municipio;

    @jsonMember
    idTipoVehiculo: TipoVehiculo;

    @jsonMember
    idUsuario?:Usuario;

    @jsonMember
    latOrigen:number;

    @jsonMember
    lonOrigen:number;

    @jsonMember
    latDest:number;
    
    @jsonMember
    lonDest:number;

    @jsonMember
    idTipoServicio: TipoServicio;

    @jsonMember
    peso: number;

    @jsonMember
    cantidad: number | null;

    @jsonMember
    programado: boolean;

    @jsonMember
    fechaProgramacion: Date | null;
}