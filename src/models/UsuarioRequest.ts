import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { Usuario } from "../entities/Usuario";

@jsonObject
export class UsuarioRequest
{
    @jsonMember
    idUsuario:string;

    @jsonMember
    usuario:string;

    get IdUsuario():number {
        return this.idUsuario!=null?parseInt(this.idUsuario):0;
    }

    get Usuario():Usuario {
        try
        {
            var serializer = new TypedJSON(Usuario);
            var usr=serializer.parse(this.usuario);
            return usr;
        }
        catch(err)
        {
            return null;
        }
    }
}