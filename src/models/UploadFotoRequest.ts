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

    isValid()
    {
        var toReturn={ 
            valid:true,
            message:""
        }
        var valid:boolean=true;
        if(this.img==null) 
        {
            toReturn.valid=false;
            toReturn.message+="La imagen no puede ser vacia\n";
        }
        if(this.idTipoDoc==null || isNaN(parseInt(this.idTipoDoc)))   
        {
            toReturn.valid=false;
            toReturn.message+="Debe incluir un tipo de documento válido\n";
        }
        else if(this.idUsuario==null || isNaN(parseInt(this.idUsuario)))
        {
            toReturn.valid=false;
            toReturn.message+="Debe incluir un id de usuario válido\n";
        }
        return toReturn;
    }
}