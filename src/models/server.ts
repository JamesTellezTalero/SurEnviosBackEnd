import * as express from 'express';
import { createConnection } from 'typeorm';
import { UsuarioBusiness } from './business/UsuariosBusiness';
import { Response } from './models/Response';
import { TypeResponse} from './models/Response';
import { TypedJSON } from 'typedjson';
import { LoginRequest } from './models/LoginRequest';
import { dbConfig } from './dbConfig';
import { EstablecimientoRequest } from './models/EstablecimientoRequest';
import { EstablecimientoBusiness } from './business/EstablecimientoBusiness';
import Establecimiento  from './entities/Establecimiento';
import { UsuarioRequest } from './models/UsuarioRequest';
import { ParametersBusiness } from './business/ParametersBusiness';
import { TurnosRequest } from './models/TurnosRequest';
import { TurnoBusiness } from './business/TurnoBusiness';
import Turnos from './entities/Turnos';
import { CancelTurnoRequest } from './models/CancelTurnoRequest';
import { PwdChangeRequest } from './models/PwdChangeRequest';
import { PushTokenRequest } from './models/PushTokenRequest';
import { RecoverRequest } from './models/RecoverRequest';
import { EncuestaRequest } from './models/EncuestaRequest';
import { AthleticBusiness } from './business/AthleticBusiness';

const UsuarioB = new UsuarioBusiness()
const EstablecimientoB = new EstablecimientoBusiness();
const ParametersB = new ParametersBusiness();
const TurnosB= new TurnoBusiness();

const port=3000;
createConnection(dbConfig).catch((error)=>console.log(error));
console.log("connected");
const bodyParser = require('body-parser');
const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));

//#region Global

app.post('/GetParameters', async (req, res)=>{
    try
    {
        var response:Response=new Response();
        var params=await ParametersB.GetParameters();
        if(params!=null)
        {
            response.Message="";
            response.Type=TypeResponse.Ok;
            response.Value=JSON.stringify(params);
        }
        else
        {
            response.Message="No hay parametros configurados";
            response.Type=TypeResponse.Error;
            response.Value=null;
        }
        res.send(response);
    }
    catch(error)
    {
        console.log(error);
        response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
        response.Type=TypeResponse.Error;
        response.Value=null;
        res.send(response);
    }
});
//#endregion

//#region Métodos Usuarios
    app.post('/login', (req, res)=>{
        var response:Response=new Response();
        var serializer = new TypedJSON(LoginRequest);
        var logReq=serializer.parse(req.body);
        if(logReq!=null)
        {
            var userLogged = UsuarioB.Login(logReq.username.trim(),logReq.password.trim());
            userLogged.then((result)=> {
                if(result!=null)
                {
                    response.Message="";
                    response.Type=TypeResponse.Ok;
                    response.Value=JSON.stringify(result);
                }   
                else
                {
                    response.Message="Usuario no existe o contraseña incorrecta";
                    response.Type=TypeResponse.Error;
                    response.Value=null;
                }
                res.send(response);
            });
        }
        else
        {
            response.Message="Solicitud Incorrecta";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
        
    });

    app.post('/GetUsuario', async (req, res)=> {
        var response:Response=new Response();
        try{            
            var serializer = new TypedJSON(UsuarioRequest);
            var usrReq=serializer.parse(req.body);
            if(usrReq!=null)
            {
                var usuario=await UsuarioB.GetPerfil(usrReq.IdUsuario);
                if(usuario!=null)
                {
                    response.Message="";
                    response.Type=TypeResponse.Ok;
                    response.Value=JSON.stringify(usuario);
                }
                else
                {
                    response.Message="No se encontró el usuario";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
                res.send(response);
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/UpdateUsuario', async(req, res)=> {
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(UsuarioRequest);
            var usrReq=serializer.parse(req.body);
            if(usrReq!=null)
            {
                await UsuarioB.UpdatePerfil(usrReq.Usuario.Usuario);
                response.Message="Perfil actualizado exitosamente";
                response.Type=TypeResponse.Ok,
                response.Value=JSON.stringify(usrReq.Usuario);
                res.send(response);
            }
            else
            {
                response.Message="No se pudo actualizar el perfíl del usuario";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/UpdatePushToken', async(req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(PushTokenRequest);
            var pushReq = serializer.parse(req.body);
            if(pushReq!=null)
            {
                var usuario=await UsuarioB.GetPerfil(pushReq.IdUsuario);
                if(usuario!=null)
                {
                    usuario.PlayerId=pushReq.PlayerId;
                    usuario.PushToken=pushReq.PushToken;
                    UsuarioB.UpdatePerfil(usuario);
                    response.Message="Token Actualizado";
                    response.Type=TypeResponse.Ok;
                    response.Value=null
                }
                else
                {
                    response.Message="No se encontró el usuario";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
                res.send(response);
            }
            else
            {
                response.Message="No se pudo actualizar el perfíl del usuario";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
        }
        catch(error)
        {
        }
    });

    app.post('/CreateUsuario', async(req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(UsuarioRequest);
            var usrReq=serializer.parse(req.body);
            if(usrReq!=null)
            {
                var newUser = await UsuarioB.CreatePerfil(usrReq.Usuario.Usuario);
                if(newUser!=null)
                {
                    response.Message="Perfil creado exitosamente";
                    response.Type=TypeResponse.Ok,
                    response.Value=JSON.stringify(newUser);
                }
                else
                {
                    response.Message="El correo electrónico ya se encuentra registrado";
                    response.Type=TypeResponse.Error,
                    response.Value=null;
                }
                res.send(response);
            }
            else
            {
                response.Message="No se pudo crear el perfíl de usuario";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/UpdatePwd', async(req,res)=>{
        var response:Response=new Response();
        try{            
            var serializer = new TypedJSON(PwdChangeRequest);
            var usrReq=serializer.parse(req.body);
            if(usrReq!=null)
            {
                var usuario=await UsuarioB.GetPerfil(usrReq.IdUsuario);
                if(usuario.Clave== usrReq.oldPwd)
                {
                    usuario.Clave = usrReq.newPwd;
                    await UsuarioB.UpdatePerfil(usuario);
                    response.Message="Contraseña actualizada exitosamente";
                    response.Type=TypeResponse.Ok,
                    response.Value=null;
                }
                else
                {
                    response.Message="La contraseña a cambiar no es la correcta";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/RecoverPassword', async(req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(RecoverRequest);
            var recReq=serializer.parse(req.body);
            if(recReq!=null)
            {
                var usuario = await UsuarioB.RecoverPassword(recReq.email);
                if(usuario)
                {
                    response.Message="Se ha enviado un correo electrónico con la nueva contraseña.";
                    response.Type=TypeResponse.Ok,
                    response.Value=null;
                }
                else
                {
                    response.Message="El correo electrónico no está registrado en nuestra base de datos.";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/EsEmpleadoAthletic', async(req, res)=>{
        var response:Response=new Response();
        try
        {            
            var serializer = new TypedJSON(UsuarioRequest);
            var usrReq=serializer.parse(req.body);
            if(usrReq!=null)
            {
                var usuario=await UsuarioB.GetPerfil(usrReq.IdUsuario);
                if(usuario!=null)
                {
                    if(usuario.IdTercero!=null)
                    {
                        var ABusiness=new AthleticBusiness();
                        var token= await ABusiness.GetToken();
                        var athRes=await ABusiness.GetUsuario(usuario.Documento, token.Token);
                        if(athRes!=null && !athRes.Errores && athRes.Personas.length>0)
                        {
                            if(athRes.Personas[0].EsEmpleado)
                            {
                                response.Message="Es empleado Athletic";
                                response.Type=TypeResponse.Ok;
                                response.Value=null;
                            }
                            else
                            {
                                response.Message="No es empleado Athletic";
                                response.Type=TypeResponse.Error;
                                response.Value=null
                            }
                        }
                        else
                        {
                            response.Message="No es empleado Athletic";
                            response.Type=TypeResponse.Error;
                            response.Value=null
                        }
                    }
                    else
                    {
                        response.Message="No es empleado Athletic";
                        response.Type=TypeResponse.Error;
                        response.Value=null
                    }
                }
                else
                {
                    response.Message="No es empleado Athletic";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
                res.send(response);
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

//#endregion

//#region Métodos Establecimiento

    app.post('/GetEstablecimiento',async (req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(EstablecimientoRequest);
            var estReq=serializer.parse(req.body);
            if(estReq!=null)
            {
                var est = await EstablecimientoB.GetEstablecimiento(estReq.Id);            
                response.Message="";
                response.Type=TypeResponse.Ok,
                response.Value=JSON.stringify(est);
                res.send(response);
            }
            else
            {
                response.Message="No se encontró el establecimiento";
                response.Type=TypeResponse.Error;
                response.Value=null
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/GetEstablecimientos',async (req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(EstablecimientoRequest);
            var estReq=serializer.parse(req.body);
            if(estReq!=null)
            {
                var ests = await EstablecimientoB.GetClosestEstablecimientos(estReq.Longitud, estReq.Latitud, 20000, estReq.TipoEstablecimiento, estReq.Nombre);
                if(ests!=null)
                {
                    response.Message="";
                    response.Type=TypeResponse.Ok,
                    response.Value=JSON.stringify(ests);
                }
                else
                {
                    response.Message="No se encontró información";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
                res.send(response);
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/GetEstablecimientosByName', async (req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(EstablecimientoRequest);
            var estReq=serializer.parse(req.body);
            if(estReq!=null)
            {
                var ests = await EstablecimientoB.GetEstablecimientoByName(estReq.Nombre, estReq.Ciudad, estReq.TipoEstablecimiento);
                if(ests!=null)
                {
                    response.Message="";
                    response.Type=TypeResponse.Ok,
                    response.Value=JSON.stringify(ests);
                }
                else
                {
                    response.Message="No se encontró información";
                    response.Type=TypeResponse.Error;
                    response.Value=null
                }
                res.send(response);
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });


//#endregion

//#region turnos
    app.post('/GetTurnos', async (req,res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(TurnosRequest);
            var turnReq = serializer.parse(req.body);
            if(turnReq!=null)
            {
                var turnos:Turnos[] = await TurnosB.GetTurnos(turnReq.IdEstablecimiento, turnReq.IdTipoServicio, turnReq.StartDate, turnReq.EndDate,turnReq.IdUsuario);
                response.Message="";
                response.Type=TypeResponse.Ok,
                response.Value=JSON.stringify(turnos);
            }
            else
            {
                response.Message="No se encontraron resultados";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/GetAgenda', async(req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(TurnosRequest);
            var recReq=serializer.parse(req.body);
            if(recReq!=null)
            {
                var agenda = await TurnosB.GetAgenda(recReq.IdEstablecimiento, recReq.IdTipoServicio, recReq.StartDate);
                if(agenda)
                {
                    response.Message="";
                    response.Type=TypeResponse.Ok,
                    response.Value=JSON.stringify(agenda);
                }
                else
                {
                    response.Message="Sin Agenda para la fecha indicada";
                    response.Type=TypeResponse.Error;
                    response.Value=null;
                }
            }
            else
            {
                response.Message="Solicitud Incorrecta";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/AsignarTurno', async(req, res) =>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(TurnosRequest);
            var turnReq = serializer.parse(req.body);
            if(turnReq != null)
            {
                response = await TurnosB.AsignarTurno(turnReq);
            }
            else
            {
                response.Message="No se pudo asignar el turno, valide su información e intente nuevamente";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/CheckEncuesta', async(req, res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(EncuestaRequest);
            var encReq = serializer.parse(req.body);
            if(encReq != null)
            {
                response = await TurnosB.CheckSurvey(encReq);
            }
            else
            {
                response.Message="No se pudo asignar el turno, valide su información e intente nuevamente";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/CancelTurno', async (req,res)=>{
        var response:Response=new Response();
        try
        {
            var serializer = new TypedJSON(CancelTurnoRequest);
            var cancReq = serializer.parse(req.body);
            if(cancReq!=null)
            {
                response=await TurnosB.CancelTurno(cancReq.IdTurno);
            }
            else
            {
                response.Message="No se pudo modificar el turno, valide su información e intente nuevamente";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        catch(error)
        {
            console.log(error);
            response.Message="Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type=TypeResponse.Error;
            response.Value=null;
            res.send(response);
        }
    });

    app.post('/CheckInTurno', async (req, res) => {
        var response: Response = new Response();
        try {
            var serializer = new TypedJSON(CancelTurnoRequest);
            var cancReq = serializer.parse(req.body);
            if (cancReq != null) {
                response = await TurnosB.CheckTurno(cancReq.IdTurno);
            }
            else {
                response.Message = "No se pudo modificar el turno, valide su información e intente nuevamente";
                response.Type = TypeResponse.Error;
                response.Value = null;
            }
            res.send(response);
        }
        catch (error) {
            console.log(error);
            response.Message = "Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type = TypeResponse.Error;
            response.Value = null;
            res.send(response);
        }
    });

    app.post('/GetQRCode', async (req, res)=>{
        var response: Response = new Response();
        try {
            var serializer = new TypedJSON(UsuarioRequest);
            var usrReq = serializer.parse(req.body);
            if (usrReq != null) {
                response = await UsuarioB.GenerateQR(usrReq.IdUsuario);
            }
            else {
                response.Message = "No se pudo generar el código QR, valide su información e intente nuevamente";
                response.Type = TypeResponse.Error;
                response.Value = null;
            }
            res.send(response);
        }
        catch (error) {
            console.log(error);
            response.Message = "Se presentó una excepcion no controlada, por favor contáctese con el proveedor del servicio";
            response.Type = TypeResponse.Error;
            response.Value = null;
            res.send(response);
        }
    });
//#endregion

    app.get('/',(req, res)=>{
        res.send('Hola mundo');
    });

    app.listen(port, () => {
        console.log('Ready on port '+port+'!');
    });