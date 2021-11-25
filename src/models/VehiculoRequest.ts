import { TypedJSON } from "typedjson";
import { Vehiculo } from "../entities/Vehiculo";

export class VehiculoRequest
{
    idVehiculo:string;
    
    vehiculo:string;

    get IdVehiculo():number
    {
        return this.idVehiculo!=null?parseInt(this.idVehiculo):0;
    }

    get Vehiculo():Vehiculo
    {
        try
        {
            var serializer = new TypedJSON(Vehiculo);
            var usr=serializer.parse(this.vehiculo);
            return usr;
        }
        catch(err)
        {
            return null;
        }
    }
}