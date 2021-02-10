import { jsonObject, jsonMember } from "typedjson";

@jsonObject
export class RecoverRequest
{
    @jsonMember
    email:string;
}