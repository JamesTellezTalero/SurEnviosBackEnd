import 'reflect-metadata';
import { jsonObject, jsonMember, TypedJSON } from 'typedjson';

@jsonObject
export class LoginRequest
{
    @jsonMember
    username:string;
    
    @jsonMember
    password:string;
}