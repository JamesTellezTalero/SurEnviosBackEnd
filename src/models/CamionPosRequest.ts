import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class CamionPosRequest
{
    @jsonMember
    lat:string;

    @jsonMember
    lon:string;

    @jsonMember
    idTipoCamion:string;

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