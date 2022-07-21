/*
    SRC/MODELS/ResponseV2
**/

export class ResponseV2{
    Type:TypeResponse;
    Message:string;
    Value;
}

export enum TypeResponse{
    Ok,
    Error,
    Encuesta
}