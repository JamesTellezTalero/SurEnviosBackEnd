import { jsonMember, jsonObject, TypedJSON } from "typedjson";

@jsonObject
export class DireccionRequest
{
    @jsonMember
    id: string;
  
    @jsonMember
    direccion: string;
  
    @jsonMember
    estado: string;
  
    @jsonMember
    esDefault: string;
  
    @jsonMember
    complemento: string;
  
    @jsonMember
    idCliente: string;
  
    @jsonMember
    idCiudad: string;

    get Id():number
    {
       return this.id!=null?parseInt(this.id):0; 
    }

    get IdCliente():number
    {
       return this.idCliente!=null?parseInt(this.idCliente):0; 
    }

    get IdCiudad():number
    {
        return this.idCiudad!=null?parseInt(this.idCiudad):0;

    }

    get EsDefault():boolean
    {
       return this.esDefault!=null? this.esDefault=='True'? true : false : false; 
    }
}