import { jsonArrayMember, jsonMapMember, jsonMember, jsonObject } from "typedjson";
import { TypeResponse } from "./Response";

@jsonObject
export class SocketParameter
{
    @jsonMember
    key:string;

    @jsonMember
    value:string;
}

@jsonObject
export class SocketModel
{
    @jsonMember
    method:string;

    @jsonArrayMember(SocketParameter)
    parameters:SocketParameter[];

    @jsonMember
    type:TypeResponse;

    GetParameter(key:string):SocketParameter
    {
        var item= this.parameters.find(m=>m.key==key);
        return item;
    }
}

export class UserSocket
{
    idUsuario:number;

    ipAddress:string;

    socket:any;
}
