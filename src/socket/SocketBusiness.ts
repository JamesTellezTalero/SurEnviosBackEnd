import { Socket } from "net";
import * as ws from 'ws';
import { TypedJSON } from "typedjson";
import { getManager, getRepository, Not } from "typeorm";
//import { ParametersBusiness } from "../business/ParametersBusiness";
//import { UtilBusiness } from "../business/UtilsBusiness";
import { UsuarioPos } from "../entities/UsuarioPos";
import { Parametros } from "../entities/Parametros";
import { Servicio } from "../entities/Servicio";
import { SocketModel, SocketParameter } from "../models/SocketModel";
//import { TokenRequest } from "../models/TokenRequest";
import { EventEmitter } from "events";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Usuario } from "../entities/Usuario";
import { TypeResponse } from "../models/Response";
import { NotificationPushBusiness } from "../business/NotificationPushBusiness";
import { UsuarioRequest } from "../entities/UsuarioRequest";
import { Perfil } from "../entities/Perfil";
import { TipoServicio } from "../entities/TipoServicio";
import { Vehiculo } from "../entities/Vehiculo";
import { TipoVehiculo } from "../entities/TipoVehiculo";
var otpGenerator = require("otp-generator");

export class SocketBusiness extends EventEmitter
{
    //UtilsB=new UtilBusiness();
    PushB=new NotificationPushBusiness();

    DeserializeMessage(message:string):SocketModel
    {
        var serializer = new TypedJSON(SocketModel);
        var socketModel=serializer.parse(message);
        return socketModel;
    }

    SetMethod(req:SocketModel)
    {
        switch(req.method)
        {
            case "RegisterOperator":
                this.ProcessRegisterOperator(req);
                break;
            case "RegisterClient":
                this.ProcessRegisterClient(req);
                break;
            case "SendPos":
                this.SetPos(req);
                break;
            case "TakeService":
                this.TakeService(req);
                break;
            case "PickUpService":
                this.PickUpService(req);
                break;
            case "DeliverService":
                this.DeliverService(req);
                break;
            case "RejectService":
                this.RejectService(req);
                break;
        }
    }

    async GetPerfilByTipoServicio(idTipoServicio:number)
    {
        var tipoServicio=await getManager().getRepository(TipoServicio).findOne({where:{id:idTipoServicio}});
        switch(tipoServicio.nombre.toUpperCase())
        {
            case "MENSAJERIA EXPRESA":
                return await getManager().getRepository(Perfil).findOne({where:{nombre:"Mensajería"}});
            case "PAQUETEO":
                return await getManager().getRepository(Perfil).findOne({where:{nombre:"Paquetería"}});
            case "CARGA DIMENSIONADA":
                return await getManager().getRepository(Perfil).findOne({where:{nombre:"Carga Dimensionada"}});
            case "DILIGENCIAS":
                return await getManager().getRepository(Perfil).findOne({where:{nombre:"Diligencias"}});
            case "TRANSPORTE DEDICADO":
                return await getManager().getRepository(Perfil).findOne({where:{nombre:"Transporte Dedicado"}});
        }
        return null;
    }

    async ProcessNearOperators(Servicio:Servicio)
    {
        var perfil=await this.GetPerfilByTipoServicio(Servicio.idTipoServicio.id);
        var operators = await this.GetNearOperators(Servicio.latOrigen, Servicio.lonOrigen, perfil.id, Servicio.idTipoVehiculo);
        console.log("Operadores: "+operators.length);
        //se realizan por separado el guardado en db del request al envío debido a que si hay demora con la conexión de la db no afecte el tiempo de envío al domiciliaro del request.
        operators.forEach(async item=>{
            var domReq:UsuarioRequest= await getManager().getRepository(UsuarioRequest).findOne({where:{idUsuario:item.idUsuario,idServicio:Servicio.id}});
            if(domReq!=null)
            {
                domReq.respuesta=1;
            }
            else
            {
                domReq=new UsuarioRequest();
                domReq.idUsuario=item.idUsuario;
                domReq.idServicio=Servicio.id;
                domReq.respuesta=1;
            }
            getManager().getRepository(UsuarioRequest).save(domReq);
        });
        operators.forEach(item => {
            this.emit('SendServicio', item.idUsuario, Servicio);
        });
    }
    

    async GetNearOperators(lat:number,lon:number, perfil:number, tipoVehiculo:TipoVehiculo):Promise<UsuarioPos[]>
    {
        var idTipoVehiculo=tipoVehiculo!=null?tipoVehiculo.id:null;
        //console.log(lat+","+lon);
        var distancia = await getManager().getRepository(Parametros).findOne({where:{parametro:"radioBusqueda"}});
        var valueDistancia = parseInt(distancia.value);
        var users = await getManager().getRepository(UsuarioPos)
        .createQueryBuilder("Dom")
        .addSelect("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000","distancia")
        .innerJoin(Usuario,"u","Dom.idUsuario=u.id")
        .leftJoin(Vehiculo,"v", "u.id=v.idUsuario")
        .leftJoin(TipoVehiculo,"tv","v.idTipoVehiculo=tv.id")
        .where("Dom.activo=:status",{ status : 1 })
        .andWhere("enEntrega=:busy",{ busy : 0 })
        .andWhere("u.idPerfil=:perfil",{ perfil : perfil })
        .andWhere("(v.idTipoVehiculo=:idTV or :idTV is null)",{ idTV : idTipoVehiculo })
        .andWhere("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000  < :distancia",{ Lat:lat, Long:lon,distancia:valueDistancia})
        .getMany();
        return users;
    }

    async ProcessRegisterOperator(request:SocketModel)
    {
        var idUsuario=parseFloat(request.GetParameter("idUsuario").value);
        var user=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:idUsuario}});
        user.activo=true;
        getManager().getRepository(UsuarioPos).save(user);
        this.emit('AddOperatorSocket', request, idUsuario);
    }

    async ProcessRegisterClient(request:SocketModel)
    {
        var idCliente=parseFloat(request.GetParameter("idCliente").value);
        this.emit('AddClientSocket', request, idCliente);
    }

    async SetPos(request:SocketModel)
    {
        var lat=parseFloat(request.GetParameter("lat").value);
        var lon=parseFloat(request.GetParameter("lon").value);
        var idUsuario=parseFloat(request.GetParameter("idUsuario").value);
        var userPos:UsuarioPos = new UsuarioPos();
        userPos.idUsuario=idUsuario;
        userPos.lat=lat;
        userPos.lon=lon;
        getManager().getRepository(UsuarioPos).save(userPos);
    }

    async TakeService(request:SocketModel)
    {
        console.log("Taking service...")
        var sm:SocketModel=new SocketModel();
        sm.method="TakeService";
        var response;
        var sendResponse=false;
        var idServicio=parseInt(request.GetParameter("idServicio").value);
        var idUsuario=parseInt(request.GetParameter("idUsuario").value);
        var aceptado=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Aceptado"}});
        var usuario=await getManager().getRepository(Usuario).findOne({where:{id:idUsuario}, relations:["idPersona", "vehiculos", "vehiculos.idTipoVehiculo"]});
        var usuarioPos=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:idUsuario}});
        var servicio= await getManager().getRepository(Servicio).findOne({where:{id:idServicio}, relations:["estadoServicio","idCliente", "idTipoVehiculo"]});
        console.log("validando Servicio en estado solicitado y domiciliario nulo");
        if(servicio.estadoServicio.nombre=="Solicitado" && servicio.idUsuario==null)
        {
            console.log("in if");
            servicio.estadoServicio=aceptado;
            servicio.idUsuario=usuario;
            var value=otpGenerator.generate(6,{alphabets:false, upperCase: false, specialChars: false})
            servicio.otp=value;
            if(servicio.idTipoVehiculo==null && usuario.vehiculos.length!=0)
            {
                servicio.idTipoVehiculo=usuario.vehiculos[0].idTipoVehiculo;
            }
            servicio= await getManager().getRepository(Servicio).save(servicio);
            usuarioPos.enEntrega=true;
            getManager().getRepository(UsuarioPos).save(usuarioPos);
            var domReq = await getManager().getRepository(UsuarioRequest).findOne({where:{idUsuario:usuario.id, idServicio:idServicio}});
            domReq.respuesta=2;
            domReq = await getManager().getRepository(UsuarioRequest).save(domReq);
            response={ idServicio:idServicio, asignado:true, mensaje:"El Servicio ha sido asignado. Por favor diríjase al sitio de recogida."};
            var subTitle:string = "Tu Solicitud de servicio ha sido aceptado";
            var vehicleData:string = "";
            if(servicio.idTipoVehiculo != null)
                vehicleData = " en un vehículo tipo " + servicio.idTipoVehiculo.nombre + " de placas " + usuario.vehiculos[0].placa;
            var messageText:string = "Tu servicio será atendido por "+ usuario.idPersona.nombres + " " + usuario.idPersona.apellidos + vehicleData + ". Tu código de seguridad es el "+servicio.otp+". Estaremos notificándote cuando se encuentre en camino para recoger el servicio.";
            this.PushB.Notificar(servicio.idCliente.id, servicio.id, subTitle,messageText, "take");
            sm.type=TypeResponse.Ok;
            sendResponse=true;
        }
        else
        {
            console.log("in else");
            response={idServicio:idServicio, asignado:false, mensaje:"El Servicio ya ha sido tomado por otro domiciliario."};
            sm.type=TypeResponse.Error;
        }
        console.log("sending notify a otros domiciliarios");
        this.emit("NotifyPedidoTaken",idServicio);
        var param:SocketParameter={key:"response", value:JSON.stringify(response)};
        sm.parameters=[param];
        if(sendResponse)
        {
            console.log("enviando respuesta a domiciliario");
            this.emit("ReplyRequest",sm);
        }
    }

    async PickUpService(request:SocketModel)
    {
        var sm:SocketModel=new SocketModel();
        sm.method="PickUpService";
        var response;
        var idPedido=parseInt(request.GetParameter("idPedido").value);
        var idDomiciliario=parseInt(request.GetParameter("idDomiciliario").value);
        var enProceso=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Programado"}});
        var usuario=await getManager().getRepository(Usuario).findOne({where:{id:idDomiciliario}, relations:["idPersona"]});
        var servicio= await getManager().getRepository(Servicio).findOne({where:{id:idPedido}, relations:["idEstadoPedido","idCliente", "idDomiciliario"]});
        if(servicio.estadoServicio.nombre=="Aceptado" && servicio.idUsuario.id==usuario.id)
        {
            servicio.estadoServicio=enProceso;
            servicio= await getManager().getRepository(Servicio).save(servicio);
            response={ idPedido:idPedido, asignado:true, mensaje:"Por favor diríjase al sitio de entrega."};
            var subTitle:string = "Tu Servicio va en camino";
            var vehicleData:string = "";
            if(servicio.idTipoVehiculo != null)
                vehicleData = " en un vehículo tipo " + servicio.idTipoVehiculo.nombre + " de placas " + usuario.vehiculos[0].placa;
            var messageText:string = "Tu Servicio va en camino llevado por "+usuario.idPersona.nombres + vehicleData + ". Dentro de poco estará llegando a tu dirección con tu solicitud.";
            this.PushB.Notificar(servicio.idCliente.id, servicio.id, subTitle,messageText,"pickup");
            sm.type=TypeResponse.Ok;
        }
        else
        {
            response={idPedido:idPedido, asignado:false, mensaje:""};
            sm.type=TypeResponse.Error;
        }
        var param:SocketParameter={key:"response", value:JSON.stringify(response)};
        sm.parameters=[param];
        this.emit("ReplyRequest",sm);
    }

    async DeliverService(request:SocketModel)
    {
        var sm:SocketModel=new SocketModel();
        sm.method="DeliverService";
        var response;
        var idPedido=parseInt(request.GetParameter("idPedido").value);
        var idDomiciliario=parseInt(request.GetParameter("idDomiciliario").value);
        var entregado=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Entregado"}});
        var usuario=await getManager().getRepository(Usuario).findOne({where:{id:idDomiciliario}});
        var UsuarioPos=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:idDomiciliario}});
        var Servicio= await getManager().getRepository(Servicio).findOne({where:{id:idPedido}, relations:["idEstadoPedido","idCliente", "idDomiciliario"]});
        if(Servicio.idEstadoPedido.nombre=="En proceso" && Servicio.idDomiciliario.id==usuario.id)
        {
            Servicio.idEstadoPedido=entregado;
            Servicio.fechaEntrega=new Date();
            Servicio= await getManager().getRepository(Servicio).save(Servicio);
            UsuarioPos.enEntrega=false;
            getManager().getRepository(UsuarioPos).save(UsuarioPos);
            response={ idPedido:idPedido, asignado:true, mensaje:"El servicio ha finalizado correctamente."};
            var subTitle:string = "Tu Servicio ha sido entregado";
            var messageText:string = "Tu Servicio ha sido entregado. Gracias por utilizar los servicios de SEApp.";
            this.PushB.Notificar(Servicio.idCliente.id, Servicio.id, subTitle,messageText,"deliver");
            sm.type=TypeResponse.Ok;
        }
        else
        {
            response={idPedido:idPedido, asignado:false, mensaje:""};
            sm.type=TypeResponse.Error;
        }
        var param:SocketParameter={key:"response", value:JSON.stringify(response)};
        sm.parameters=[param];
        this.emit("ReplyRequest",sm);
    }

    async RejectService(request:SocketModel)
    {
        var sm:SocketModel=new SocketModel();
        sm.method="RejectService";
        var response;
        var idServicio=parseInt(request.GetParameter("idServicio").value);
        var idUsuario=parseInt(request.GetParameter("idUsuario").value);
        var domReq=await getManager().getRepository(UsuarioRequest).findOne({where:{idUsuario:idUsuario, idServicio:idServicio}});
        domReq.respuesta=3;
        await getManager().getRepository(UsuarioRequest).save(domReq);
        response={ idServicio:idServicio, asignado:false, mensaje:"Haz rechazado la solicitud."};
        sm.type=TypeResponse.Ok;        
        var param:SocketParameter={key:"response", value:JSON.stringify(response)};
        sm.parameters=[param];
        this.emit("ReplyRequest",sm);
    }

    async CancelService(Servicio:Servicio)
    {
        this.emit("CancelService",Servicio.id);
    }

    async SendCancelService(idPedido:number)
    {
        var domReqs=await getManager().getRepository(UsuarioRequest).find({where:{idServicio:idPedido, respuesta:Not(2)}});
        domReqs.forEach(async element => {
            if(element.respuesta==1)
            {
                element.respuesta=4;
                var domReq = await getManager().getRepository(UsuarioRequest).save(element);
                var myglobal:any = global;                
                var item=myglobal.sockets.find(m=>m.idUsuario==element.idUsuario);
                if(item)
                {
                    var sm:SocketModel=new SocketModel();
                    sm.method="PedidoTaken";
                    var param:SocketParameter = {key:"idPedido", value:idPedido.toString()};
                    sm.parameters=[param];
                    var socket:ws = item.socket;
                    if(socket.OPEN)
                        item.socket.send(JSON.stringify(sm));
                }
            }
        });
    }
    
    async SendNotification(message, idUsuario)
    {
        var myglobal:any = global;
        var item=myglobal.clientSockets.find(m=>m.idUsuario==idUsuario);
        if(item)
        {
            var sm:SocketModel=new SocketModel();
            sm.method="NotifyService";
            var param:SocketParameter={key:"message",value:JSON.stringify(message)};
            sm.parameters=[param];
            var socket:ws = item.socket;
            if(socket.OPEN)
                item.socket.send(JSON.stringify(sm));
        }
    }
}