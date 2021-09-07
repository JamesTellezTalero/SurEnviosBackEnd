import 'reflect-metadata';
import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { Cliente } from "../entities/Cliente";

@jsonObject
export class ClienteRequest
{
    @jsonMember
    idUsuario:string;

    @jsonMember
    usuario:string;

    get IdUsuario():number {
        return this.idUsuario!=null?parseInt(this.idUsuario):0;
    }

    get Usuario():Cliente {
        try
        {
            var serializer = new TypedJSON(Cliente);
            var usr=serializer.parse(this.usuario);
            return usr;
        }
        catch(err)
        {
            return null;
        }
    }
}