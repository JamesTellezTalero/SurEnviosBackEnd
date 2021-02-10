import { parse } from "querystring";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class GenericRequest
{
    @jsonMember
    id:string;

    @jsonMember
    estado:string;

    @jsonMember
    nombre:string;

    get Id():number
    {
        return this.id!=null?parseInt(this.id):0;
    }
}