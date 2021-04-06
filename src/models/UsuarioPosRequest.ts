import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class UsuarioPosRequest
{
    @jsonMember
    idUsuario:string;

    @jsonMember
    lat:string;

    @jsonMember
    lon:string;

    @jsonMember
    idTipoVehiculo:string;

    get IdUsuario():number
    {
        return parseInt(this.idUsuario);
    }    

    get Lat():number{
        return parseFloat(this.lat);
    }

    get Lon():number{
        return parseFloat(this.lon);
    }

    get IdTipoVehiculo():number{
        return parseInt(this.idTipoVehiculo);
    }
}