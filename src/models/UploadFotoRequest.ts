import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class UploadFotoRequest
{
    @jsonMember
    img:string;

    @jsonMember
    imgName:string;

    @jsonMember
    idTipoDoc:string

    @jsonMember
    idUsuario:string

    get IdTipoDoc():number
    {
        try
        {
            return parseInt(this.idTipoDoc);
        }
        catch(err)
        {
            return null
        }
    }

    get IdUsuario():number
    {
        try
        {
            return parseInt(this.idUsuario);
        }
        catch(err)
        {
            return null;
        }
    }

}