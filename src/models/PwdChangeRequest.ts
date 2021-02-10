import { jsonObject, jsonMember } from "typedjson";

@jsonObject
export class PwdChangeRequest
{
    @jsonMember
    idUsuario:string;

    @jsonMember
    oldPwd:string;

    @jsonMember
    newPwd:string;

    get IdUsuario():number
    {
        return this.idUsuario!=null?parseInt(this.idUsuario):0;
    }
}