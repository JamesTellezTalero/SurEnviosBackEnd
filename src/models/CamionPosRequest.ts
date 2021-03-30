import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class CamionPosRequest
{
    @jsonMember
    idCamion:string;

    @jsonMember
    lat:string;

    @jsonMember
    lon:string;

    @jsonMember
    idTipoCamion:string;

    get IdCamion():number
    {
        return parseInt(this.idCamion);
    }    

    get Lat():number{
        return parseFloat(this.lat);
    }

    get Lon():number{
        return parseFloat(this.lon);
    }

    get IdTipoCamion():number{
        return parseInt(this.idTipoCamion);
    }
}