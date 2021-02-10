import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { ServicioModel } from "./ServicioModel";

@jsonObject
export class ServicioRequest
{
    @jsonMember
    servicio:string;

    get Servicio():ServicioModel {
        try
        {
            var serializer = new TypedJSON(ServicioModel);
            var srv=serializer.parse(this.servicio);
            return srv;
        }
        catch(err)
        {
            return null;
        }
    }
}