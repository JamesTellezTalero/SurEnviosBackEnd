import { Socket } from "net";
import * as ws from 'ws';
import { TypedJSON } from "typedjson";
import { getManager, getRepository, Not } from "typeorm";
import { ParametersBusiness } from "../Business/ParametersBusiness";
import { UtilBusiness } from "../Business/UtilsBusiness";
import { DomiciliarioPos } from "../entity/DomiciliarioPos";
import { Parametros } from "../entity/Parametros";
import { Pedido } from "../entity/Pedido";
import { SocketModel, SocketParameter } from "../models/SocketModel";
import { TokenRequest } from "../models/TokenRequest";
import { EventEmitter } from "events";
import { EstadoPedido } from "../entity/EstadoPedido";
import { Domiciliario } from "../entity/Domiciliario";
import { TypeResponse } from "../models/Response";
import { NotificationPushBusiness } from "../Business/NotificationPushBusiness";
import { DomiciliarioRequest } from "../entity/DomiciliarioRequest";

export class SocketBusiness extends EventEmitter
{
    UtilsB=new UtilBusiness();
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

    async ProcessNearOperators(pedido:Pedido)
    {
        var operators = await this.GetNearOperators(pedido.geolat, pedido.geolon);
        console.log("Operadores: "+operators.length);
        //se realizan por separado el guardado en db del request al envío debido a que si hay demora con la conexión de la db no afecte el tiempo de envío al domiciliaro del request.
        operators.forEach(async item=>{
            var domReq:DomiciliarioRequest= await getManager().getRepository(DomiciliarioRequest).findOne({where:{idDomiciliario:item.idUsuario,idPedido:pedido.id}});
            if(domReq!=null)
            {
                domReq.respuesta=1;
            }
            else
            {
                domReq=new DomiciliarioRequest();
                domReq.idDomiciliario=item.idUsuario;
                domReq.idPedido=pedido.id;
                domReq.respuesta=1;
            }
            getManager().getRepository(DomiciliarioRequest).save(domReq);
        });
        operators.forEach(item => {
            this.emit('SendPedido', item.idUsuario, pedido);
        });
    }
    

    async GetNearOperators(lat:number,lon:number):Promise<DomiciliarioPos[]>
    {
        //console.log(lat+","+lon);
        var distancia = await getManager().getRepository(Parametros).findOne({where:{parametro:"radioBusqueda"}});
        var valueDistancia = parseInt(distancia.value);
        var domics = await getManager().getRepository(DomiciliarioPos)
        .createQueryBuilder("Dom")
        .addSelect("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000","distancia")
        .where("activo=:status",{ status : 1 })
        .andWhere("enEntrega=:busy",{ busy : 0 })
        .andWhere("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000  < :distancia",{ Lat:lat, Long:lon,distancia:valueDistancia})
        .getMany();
        return domics;
    }

    async ProcessRegisterOperator(request:SocketModel)
    {
        var idUsuario=parseFloat(request.GetParameter("idUsuario").value);
        var user=await getManager().getRepository(DomiciliarioPos).findOne({where:{idUsuario:idUsuario}});
        user.activo=true;
        getManager().getRepository(DomiciliarioPos).save(user);
        this.emit('AddOperatorSocket', request, idUsuario);
    }

    async SetPos(request:SocketModel)
    {
        var lat=parseFloat(request.GetParameter("lat").value);
        var lon=parseFloat(request.GetParameter("lon").value);
        var idUsuario=parseFloat(request.GetParameter("idUsuario").value);
        var userPos:DomiciliarioPos = new DomiciliarioPos();
        userPos.idUsuario=idUsuario;
        userPos.lat=lat;
        userPos.lon=lon;
        getManager().getRepository(DomiciliarioPos).save(userPos);
    }

    async TakeService(request:SocketModel)
    {
        console.log("Taking service...")
        var sm:SocketModel=new SocketModel();
        sm.method="TakeService";
        var response;
        var sendResponse=false;
        var idPedido=parseInt(request.GetParameter("idPedido").value);
        var idDomiciliario=parseInt(request.GetParameter("idDomiciliario").value);
        var aceptado=await getManager().getRepository(EstadoPedido).findOne({where:{nombre:"Aceptado"}});
        var domiciliario=await getManager().getRepository(Domiciliario).findOne({where:{id:idDomiciliario}});
        var domiciliarioPos=await getManager().getRepository(DomiciliarioPos).findOne({where:{idUsuario:idDomiciliario}});
        var pedido= await getManager().getRepository(Pedido).findOne({where:{id:idPedido}, relations:["idEstadoPedido","idCliente"]});
        console.log("validando pedido en estado solicitado y domiciliario nulo");
        if(pedido.idEstadoPedido.nombre=="Solicitado" && pedido.idDomiciliario==null)
        {
            console.log("in if");
            pedido.idEstadoPedido=aceptado;
            pedido.idDomiciliario=domiciliario;
            pedido= await getManager().getRepository(Pedido).save(pedido);
            domiciliarioPos.enEntrega=true;
            getManager().getRepository(DomiciliarioPos).save(domiciliarioPos);
            var domReq = await getManager().getRepository(DomiciliarioRequest).findOne({where:{idDomiciliario:domiciliario.id, idPedido:idPedido}});
            domReq.respuesta=2;
            domReq = await getManager().getRepository(DomiciliarioRequest).save(domReq);
            response={ idPedido:idPedido, asignado:true, mensaje:"El pedido ha sido asignado. Por favor diríjase al establecimiento."};
            var subTitle:string = "Tu pedido ha sido aceptado";
            var messageText:string = "Tu pedido será atendido por "+domiciliario.nombre+ ". Dentro de poco estará llegando a tu dirección con tu solicitud.";
            this.PushB.Notificar(pedido.idCliente.id, pedido.id, subTitle,messageText, "take");
            sm.type=TypeResponse.Ok;
            sendResponse=true;
        }
        else
        {
            console.log("in else");
            response={idPedido:idPedido, asignado:false, mensaje:"El pedido ya ha sido tomado por otro domiciliario."};
            sm.type=TypeResponse.Error;
        }
        console.log("sending notify a otros domiciliarios");
        this.emit("NotifyPedidoTaken",idPedido);
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
        var enProceso=await getManager().getRepository(EstadoPedido).findOne({where:{nombre:"En proceso"}});
        var domiciliario=await getManager().getRepository(Domiciliario).findOne({where:{id:idDomiciliario}});
        var pedido= await getManager().getRepository(Pedido).findOne({where:{id:idPedido}, relations:["idEstadoPedido","idCliente", "idDomiciliario"]});
        if(pedido.idEstadoPedido.nombre=="Aceptado" && pedido.idDomiciliario.id==domiciliario.id)
        {
            pedido.idEstadoPedido=enProceso;
            pedido= await getManager().getRepository(Pedido).save(pedido);
            response={ idPedido:idPedido, asignado:true, mensaje:"Por favor diríjase al sitio de entrega."};
            var subTitle:string = "Tu pedido va en camino";
            var messageText:string = "Tu pedido va en camino llevado por "+domiciliario.nombre+ ". Dentro de poco estará llegando a tu dirección con tu solicitud.";
            this.PushB.Notificar(pedido.idCliente.id, pedido.id, subTitle,messageText,"pickup");
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
        var entregado=await getManager().getRepository(EstadoPedido).findOne({where:{nombre:"Entregado"}});
        var domiciliario=await getManager().getRepository(Domiciliario).findOne({where:{id:idDomiciliario}});
        var domiciliarioPos=await getManager().getRepository(DomiciliarioPos).findOne({where:{idUsuario:idDomiciliario}});
        var pedido= await getManager().getRepository(Pedido).findOne({where:{id:idPedido}, relations:["idEstadoPedido","idCliente", "idDomiciliario"]});
        if(pedido.idEstadoPedido.nombre=="En proceso" && pedido.idDomiciliario.id==domiciliario.id)
        {
            pedido.idEstadoPedido=entregado;
            pedido.fechaEntrega=new Date();
            pedido= await getManager().getRepository(Pedido).save(pedido);
            domiciliarioPos.enEntrega=false;
            getManager().getRepository(DomiciliarioPos).save(domiciliarioPos);
            response={ idPedido:idPedido, asignado:true, mensaje:"El servicio ha finalizado correctamente."};
            var subTitle:string = "Tu pedido ha sido entregado";
            var messageText:string = "Tu pedido ha sido entregado. Gracias por utilizar los servicios de SEApp.";
            this.PushB.Notificar(pedido.idCliente.id, pedido.id, subTitle,messageText,"deliver");
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
        var idPedido=parseInt(request.GetParameter("idPedido").value);
        var idDomiciliario=parseInt(request.GetParameter("idDomiciliario").value);
        var domReq=await getManager().getRepository(DomiciliarioRequest).findOne({where:{idDomiciliario:idDomiciliario, idPedido:idPedido}});
        domReq.respuesta=3;
        await getManager().getRepository(DomiciliarioRequest).save(domReq);
        response={ idPedido:idPedido, asignado:false, mensaje:"Haz rechazado la solicitud."};
        sm.type=TypeResponse.Ok;        
        var param:SocketParameter={key:"response", value:JSON.stringify(response)};
        sm.parameters=[param];
        this.emit("ReplyRequest",sm);
    }

    async CancelService(pedido:Pedido)
    {
        this.emit("CancelService",pedido.id);
    }

    async SendCancelService(idPedido:number)
    {
        var domReqs=await getManager().getRepository(DomiciliarioRequest).find({where:{idPedido:idPedido, respuesta:Not(2)}});
        domReqs.forEach(async element => {
            if(element.respuesta==1)
            {
                element.respuesta=4;
                var domReq = await getManager().getRepository(DomiciliarioRequest).save(element);
                var myglobal:any = global;                
                var item=myglobal.sockets.find(m=>m.idUsuario==element.idDomiciliario);
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
}