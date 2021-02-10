import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { RegistroServicioModel } from "./RegistroServicioModel";

@jsonObject
export class RegistroServicioRequest
{
    @jsonMember
    registroServicio:string;

    get RegistroServicio():RegistroServicioModel {
        try
        {
            var serializer = new TypedJSON(RegistroServicioModel);
            var regsrv=serializer.parse(this.registroServicio);
            return regsrv;
        }
        catch(err)
        {
            return null;
        }
    }
}