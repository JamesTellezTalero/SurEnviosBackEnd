export class Response{
    Type:TypeResponse;
    Message:string;
    Value:string;
}

export enum TypeResponse{
    Ok,
    Error,
    Encuesta
}