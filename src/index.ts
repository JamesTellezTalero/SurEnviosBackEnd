import * as ws from 'ws';
import * as express from 'express';
import "reflect-metadata";
import { TypedJSON } from 'typedjson';
import {createConnection} from "typeorm";
import { VehiculoBusiness } from './business/VehiculoBusiness';
import { ClienteBusiness } from './business/ClienteBusiness';
import { ParametrosBusiness } from './business/ParametrosBusiness';
import { ServicioBusiness } from './business/ServicioBusiness';
import { UsuarioBusiness } from './business/UsuarioBusiness';
import { dbConfig } from './dbConfig';
import { Usuario } from './entities/Usuario';
import { UsuarioPosRequest } from './models/UsuarioPosRequest';
import { ClienteRequest } from './models/ClienteRequest';
import { ElementoRegistroRequest } from './models/ElementoRegistroRequest';
import { GenericRequest } from './models/GenericRequest';
import { LoginRequest } from './models/LoginRequest';
import { PushTokenRequest } from './models/PushTokenRequest';
import { PwdChangeRequest } from './models/PwdChangeRequest';
import { RecoverRequest } from './models/RecoverRequest';
import { RegistroServicioRequest } from './models/RegistroServicioRequest';
import { Response, TypeResponse } from './models/Response';
import { ServicioRequest } from './models/ServicioRequest';
import { UsuarioRequest } from './models/UsuarioRequest';
import { SocketBusiness } from './socket/SocketBusiness';
import { SocketServer } from './socket/SocketServer';
import { SocketModel, SocketParameter } from './models/SocketModel';
import { XueServiceBusiness } from './business/XueServicesBusiness';
import { XueServiceRequest } from './models/XueServiceRequest';
import { DireccionRequest } from './models/DireccionRequest';
import { DireccionCliente } from './entities/DireccionCliente';
import { UploadFotoRequest } from './models/UploadFotoRequest';

const ClienteB = new ClienteBusiness();
const UsuarioB = new UsuarioBusiness();
const ServicioB = new ServicioBusiness();
const ParametrosB=new ParametrosBusiness();
const VehiculoB=new VehiculoBusiness();
const SocketB=new SocketBusiness();
const WSServer=new SocketServer();
const XueB=new XueServiceBusiness();

WSServer.StartSocket();

const port=3010;
createConnection(dbConfig).catch((error)=>console.log(error));
console.log("connected");
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


app.get('/',(req, res)=>{
    res.send('Welcome to SurEnvios BackEnd. Please refer to Server Administrator for get access to the services');
});
//#region Cliente

app.post('/loginCliente',async (req, res)=>{
    var response:Response=new Response();
    var serializer = new TypedJSON(LoginRequest);
    var logReq=serializer.parse(req.body);
    if(logReq!=null)
    {
        var userLogged = await ClienteB.Login(logReq.username.trim(),logReq.password.trim());
        if(userLogged!=null)
        {
            response.Message="";
            response.Type=TypeResponse.Ok;
            response.Value=JSON.stringify(userLogged);
        }   
        else
        {
            response.Message="Usuario no existe o contraseña incorrecta";
            response.Type=TypeResponse.Error;
            response.Value=null;
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
    
});

app.post('/GetCliente', async (req, res)=> {
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var usuario=await ClienteB.GetPerfil(usrReq.Id);
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

app.post('/UpdateCliente', async(req, res)=> {
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ClienteRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            await ClienteB.UpdatePerfil(usrReq.Usuario);
            response.Message="Perfil actualizado exitosamente";
            response.Type=TypeResponse.Ok;
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
            var usuario=await ClienteB.GetPerfil(pushReq.IdUsuario);
            if(usuario!=null)
            {
                usuario.playerId=pushReq.PlayerId;
                usuario.pushToken=pushReq.PushToken;
                ClienteB.UpdatePerfil(usuario);
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

app.post('/CreateCliente', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ClienteRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var newUser = await ClienteB.CreatePerfil(usrReq.Usuario);
            if(newUser!=null)
            {
                response.Message="Perfil creado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newUser);
            }
            else
            {
                response.Message="El correo electrónico ya se encuentra registrado";
                response.Type=TypeResponse.Error;
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

app.post('/UpdatePwdCliente', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(PwdChangeRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var usuario=await ClienteB.GetPerfil(usrReq.IdUsuario);
            if(usuario.password== usrReq.oldPwd)
            {
                usuario.password = usrReq.newPwd;
                await ClienteB.UpdatePerfil(usuario);
                response.Message="Contraseña actualizada exitosamente";
                response.Type=TypeResponse.Ok;
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

app.post('/RecoverPasswordCliente', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(RecoverRequest);
        var recReq=serializer.parse(req.body);
        if(recReq!=null)
        {
            var usuario = await ClienteB.RecoverPassword(recReq.email);
            if(usuario)
            {
                response.Message="Se ha enviado un correo electrónico con la nueva contraseña.";
                response.Type=TypeResponse.Ok;
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

app.post('/GetServiciosByCliente', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicios=await ServicioB.GetServiciosByCliente(genReq.Id);
            if(servicios!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicios);
            }
            else
            {
                response.Message="No se encontraron servicios";
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

app.post('/CreateDireccionCliente', async(req,res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(DireccionRequest);
        var usrDir=serializer.parse(req.body);
        if(usrDir!=null)
        {
            var newDir = await ClienteB.CreateDireccion(usrDir);
            if(newDir!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok,
                response.Value=JSON.stringify(newDir);
            }
            else
            {
                response.Message="No se pudo crear la dirección";
                response.Type=TypeResponse.Error,
                response.Value=null;
            }
            res.send(response);
        }
        else
        {
            response.Message="No se pudo crear la dirección";
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

app.post('/DeleteDireccionCliente', async(req,res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(GenericRequest);
        var usrDir=serializer.parse(req.body);
        if(usrDir!=null)
        {
            await ClienteB.DeleteDireccion(usrDir.Id);

            response.Message="";
            response.Type=TypeResponse.Ok,
            response.Value=null;
            res.send(response);
        }
        else
        {
            response.Message="No se pudo eliminar la dirección";
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

//#endregion

//#region Usuario
app.post('/loginUsuario', (req, res)=>{
    var response:Response=new Response();
    try
    {
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
            await UsuarioB.UpdatePerfil(usrReq.Usuario);
            response.Message="Perfil actualizado exitosamente";
            response.Type=TypeResponse.Ok;
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


app.post('/CreateUsuario', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(UsuarioRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var newUser = await UsuarioB.CreatePerfil(usrReq.Usuario);
            if(newUser!=null)
            {
                response.Message="Perfil creado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newUser);
            }
            else
            {
                response.Message="El correo electrónico ya se encuentra registrado";
                response.Type=TypeResponse.Error;
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

app.post('/UploadFotoDocumento', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(UploadFotoRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var newImg = await UsuarioB.UploadFotoDocumento(usrReq.img, usrReq.imgName, usrReq.IdTipoDoc, usrReq.IdUsuario);
            if(newImg!=null)
            {
                response.Message="Imagen subida exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newImg);
            }
            else
            {
                response.Message="No fue posible subir la imagen";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        else
        {
            response.Message="No fue posible subir la imagen";
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

app.post('/UpdatePwdUsuario', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(PwdChangeRequest);
        var usrReq=serializer.parse(req.body);
        if(usrReq!=null)
        {
            var usuario=await UsuarioB.GetPerfil(usrReq.IdUsuario);
            if(usuario.password== usrReq.oldPwd)
            {
                usuario.password = usrReq.newPwd;
                await UsuarioB.UpdatePerfil(usuario);
                response.Message="Contraseña actualizada exitosamente";
                response.Type=TypeResponse.Ok;
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

app.post('/RecoverPasswordUsuario', async(req, res)=>{
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
                response.Type=TypeResponse.Ok;
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

//#endregion

app.post('/CrearServicio', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ServicioRequest);
        var srvReq=serializer.parse(req.body);
        if(srvReq!=null)
        {
            var newServ = await ServicioB.CrearServicioCliente(srvReq.Servicio);
            if(newServ!=null)
            {
                response.Message="Servicio creado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newServ);
                res.send(response);
                if(!srvReq.Servicio.programado)
                {
                    SocketB.removeAllListeners();
                    SocketB.on('SendServicio', (idUser, servicio)=>{
                        var myglobal:any = global;
                        var item=myglobal.sockets.find(m=>m.idUsuario==idUser);
                        if(item)
                        {
                            var sm:SocketModel=new SocketModel();
                            sm.method="RecieveServicio";
                            var param:SocketParameter= {key:"servicio", value:JSON.stringify(servicio)};
                            sm.parameters=[param];
                            var socket:ws = item.socket;
                            if(socket.OPEN)
                                item.socket.send(JSON.stringify(sm));
                        }
                    });
                    SocketB.ProcessNearOperators(newServ);
                }
            }
            else
            {
                response.Message="No se pudo crear el servicio";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
            
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/UpdateServicio', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ServicioRequest);
        var srvReq=serializer.parse(req.body);
        if(srvReq!=null)
        {
            var newUser = await ServicioB.UpdateServicioCliente(srvReq.Servicio);
            if(newUser!=null)
            {
                response.Message="Servicio actualizado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newUser);
            }
            else
            {
                response.Message="No se pudo actualizar el servicio";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/ReenviarServicio',async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ServicioRequest);
        var srvReq=serializer.parse(req.body);
        if(srvReq!=null)
        {
            var newServ = await ServicioB.UpdateServicioCliente(srvReq.Servicio);
            if(newServ!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newServ);
                res.send(response);
                if(!srvReq.Servicio.programado)
                {
                    SocketB.removeAllListeners();
                    SocketB.on('SendServicio', (idUser, servicio)=>{
                        var myglobal:any = global;
                        var item=myglobal.sockets.find(m=>m.idUsuario==idUser);
                        if(item)
                        {
                            var sm:SocketModel=new SocketModel();
                            sm.method="RecieveServicio";
                            var param:SocketParameter= {key:"servicio", value:JSON.stringify(servicio)};
                            sm.parameters=[param];
                            var socket:ws = item.socket;
                            if(socket.OPEN)
                                item.socket.send(JSON.stringify(sm));
                        }
                    });                
                    SocketB.ProcessNearOperators(newServ);
                }
            }
            else
            {
                response.Message="No se pudo crear el servicio";
                response.Type=TypeResponse.Error;
                response.Value=null;
                res.send(response);
            }
            
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/CrearRegistroServicio', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(RegistroServicioRequest);
        var regSrvReq=serializer.parse(req.body);
        if(regSrvReq!=null)
        {
            var newReg = await ServicioB.AddRegistroServicio(regSrvReq.RegistroServicio);
            if(newReg!=null)
            {
                response.Message="Servicio actualizado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(newReg);
            }
            else
            {
                response.Message="No se pudo actualizar el servicio";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/CrearElementoRegistro',async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(ElementoRegistroRequest);
        var regSrvReq=serializer.parse(req.body);
        if(regSrvReq!=null)
        {
            var newReg = await ServicioB.AddElementoRegistro(regSrvReq);
            if(newReg!=null)
            {
                response.Message="Servicio actualizado exitosamente";
                response.Type=TypeResponse.Ok;
                response.Value=null;
            }
            else
            {
                response.Message="No se pudo actualizar el servicio";
                response.Type=TypeResponse.Error;
                response.Value=null;
            }
            res.send(response);
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/GetServiciosByUsuario', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicios=await ServicioB.GetServiciosByUsuario(genReq.Id, genReq.estado);
            if(servicios!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicios);
            }
            else
            {
                response.Message="No se encontraron servicios";
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

app.post('/GetServiciosByUsuarioActivos', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicios=await ServicioB.GetServiciosByUsuarioActivos(genReq.Id);
            if(servicios!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicios);
            }
            else
            {
                response.Message="No se encontraron servicios";
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

app.post('/GetServicios', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicios=await ServicioB.GetServicios(genReq.estado);
            if(servicios!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicios);
            }
            else
            {
                response.Message="No se encontraron servicios";
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

app.post('/GetServicio', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicio=await ServicioB.GetServicio(genReq.Id);
            if(servicio!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicio);
            }
            else
            {
                response.Message="No se encontró el servicio solicitado";
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

app.post('/GetVehiculosByPos', async(req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(UsuarioPosRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var servicio=await VehiculoB.GetNearOperators(genReq.Lat,genReq.Lon,genReq.IdTipoVehiculo);
            if(servicio!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(servicio);
            }
            else
            {
                response.Message="No se encontraron registros";
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

app.post('/GetUsuarioPos',async (req,res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(GenericRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var usuarioPos=await UsuarioB.GetUsuarioPos(genReq.Id);
            if(usuarioPos!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(usuarioPos);
            }
            else
            {
                response.Message="No se encontraron registros";
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

app.post('/UpdateUsuarioPos', async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var serializer = new TypedJSON(UsuarioPosRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            UsuarioB.UpdatePos(genReq.IdUsuario,genReq.Lat,genReq.Lon);
            response.Message="";
            response.Type=TypeResponse.Ok;
            response.Value=null;
            res.send(response);
        }
        else
        {
            response.Message="Parámetros enviados incorrectos";
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

app.post('/GetParametros',async(req, res)=>{
    var response:Response=new Response();
    try
    {
        var params=await ParametrosB.GetParametros();
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

app.post('/SendPdfXue', async (req, res)=>{
    var response:Response=new Response();
    try{            
        var serializer = new TypedJSON(XueServiceRequest);
        var genReq=serializer.parse(req.body);
        if(genReq!=null)
        {
            var usuarioPos=await XueB.CreatePdf(genReq.XueService, genReq.emailRemitente, genReq.emailDestinatario);
            if(usuarioPos!=null)
            {
                response.Message="";
                response.Type=TypeResponse.Ok;
                response.Value=JSON.stringify(usuarioPos);
            }
            else
            {
                response.Message="No se encontraron registros";
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

app.post('/SendSocketPedido', async(req, res)=>{
    var servicio = await ServicioB.GetServicio(1082);
    SocketB.removeAllListeners();
    SocketB.on('SendServicio', (idUser, servicio)=>{
        var myglobal:any = global;
        var item=myglobal.sockets.find(m=>m.idUsuario==idUser);
        if(item)
        {
            var sm:SocketModel=new SocketModel();
            sm.method="RecieveServicio";
            var param:SocketParameter= {key:"servicio", value:JSON.stringify(servicio)};
            sm.parameters=[param];
            var socket:ws = item.socket;
            if(socket.OPEN)
                item.socket.send(JSON.stringify(sm));
        }
    });
    SocketB.ProcessNearOperators(servicio);
    res.send("enviado!");
});

app.post('/ConsultarGuiaWTP', async(req,res)=>{
    //console.log(req.body);
    var request = req.body;
    XueB.ConsultarGuia(request).then(result=>{
        var data = {
            data:[
                {
                    message: result
                }
            ]
        }
        res.send(data);
    });
});

app.listen(port, () => {
    console.log('Ready on port '+port+'!');
});