import 'reflect-metadata';
import { jsonObject, jsonMember, TypedJSON } from 'typedjson';
import { parse } from 'querystring';

@jsonObject
export class PushTokenRequest
{
    @jsonMember
    idUsuario:string;

    @jsonMember
    PlayerId:string;

    @jsonMember
    PushToken:string;
    
    get IdUsuario():number
    {
        return this.idUsuario!=null?parseInt(this.idUsuario):0;
    }
}