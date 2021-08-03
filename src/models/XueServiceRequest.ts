import { jsonMember, jsonObject, TypedJSON } from "typedjson";
import { XueService } from "./XueService";

@jsonObject
export class XueServiceRequest
{
    @jsonMember
    emailRemitente:string;

    @jsonMember
    emailDestinatario:string;

    @jsonMember
    xueService:string;

    get XueService():XueService {
        try
        {
            var serializer = new TypedJSON(XueService);
            var usr=serializer.parse(this.xueService);
            return usr;
        }
        catch(err)
        {
            return null;
        }
    }
}