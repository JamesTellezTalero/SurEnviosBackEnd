import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class ElementoRegistroRequest
{
    @jsonMember
    idRegistroServicio:string;

    @jsonMember
    idTipoElemento:string;

    @jsonMember
    elemento:string;

    get IdRegistroServicio():number
    {
        return this.idRegistroServicio==null?0:parseInt(this.idRegistroServicio);
    }

    get IdTipoElemento():number
    {
        return this.idTipoElemento==null?0:parseInt(this.idTipoElemento);
    }
}