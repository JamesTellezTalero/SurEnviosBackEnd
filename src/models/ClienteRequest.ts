import 'reflect-metadata';
import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { Cliente } from "../entities/Cliente";

@jsonObject
export class ClienteRequest
{
    @jsonMember // se reciben los valores tal cual y como vienen del request
    idUsuario:string;

    @jsonMember
    usuario:string;

    get IdUsuario():number { // recibe el parametro como string y lo convierte a int
        return this.idUsuario!=null?parseInt(this.idUsuario):0;
    }

    get Usuario():Cliente {  //aqui va el arreglo que se recibio por el metodo post para poderlo deserializar
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