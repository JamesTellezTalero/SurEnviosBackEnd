import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { TypedJSON } from 'typedjson';
import { getManager, Not } from 'typeorm';
import * as ws from 'ws';
import{ UsuarioPos } from '../entities/UsuarioPos';
import { UsuarioRequest } from '../entities/UsuarioRequest';
import { TypeResponse } from '../models/Response';
import { SocketModel, SocketParameter, UserSocket } from '../models/SocketModel';
import { SocketBusiness } from './SocketBusiness';

export class SocketServer
{
    
    //static sockets:UserSocket[];
    SocketB:SocketBusiness;

    StartSocket()
    {
        var myglobal:any=global;
        myglobal.sockets=[];
        this.SocketB=new SocketBusiness();
        var webSocketServer = ws.Server;
        var webSocketServerObject = new webSocketServer({ port: 9020 });
        webSocketServerObject.on('connection', function (ws, req) {
            var userID = parseInt(req.url.substr(1), 10);
            var ipAddress=req.socket.remoteAddress;
            console.log("Connected from "+ req.socket.remoteAddress);
            ws.on('message', function (message) {
                SocketServer.ProcessRequest(message, ws, ipAddress);
            });

            ws.on('error', function(login){
                console.log("recieved from login " +login);
                ws.send("Response!");
            });

            ws.on('close', function (c, d) {
                SocketServer.RemoveSocket(ws, ipAddress);
                console.log('Disconnect ' + c + ' -- ' + ipAddress);
            });
        });
    }

    static ProcessRequest(message:ws.Data, ws:ws, ipAddress:string)
    {
        var SocketB=new SocketBusiness();
        var req=SocketB.DeserializeMessage(message.toString());
        SocketB.on('AddOperatorSocket',(request, idUser)=>{
            var myglobal:any=global;
            var item=myglobal.sockets.find(m=>m.idUsuario==idUser);
            if(item)
            {
                item.ipAddress=ipAddress;
                item.socket=ws;
            }
            else
            {
                var userSocket:UserSocket=new UserSocket();
                userSocket.idUsuario=idUser;
                userSocket.ipAddress=ipAddress;
                userSocket.socket=ws;
                myglobal.sockets.push(userSocket);
                item=myglobal.sockets.find(m=>m.idUsuario==idUser);
            }
            //console.log("sockets: "+myglobal.sockets.length);
            var res:SocketModel=new SocketModel();
            res.method=req.method;
            res.type=TypeResponse.Ok;
            item.socket.send(JSON.stringify(res));
            SocketB.removeAllListeners();
        });

        SocketB.on('ReplyRequest',(response)=>{
            ws.send(JSON.stringify(response));
            SocketB.removeAllListeners();
        });

        SocketB.on('NotifyPedidoTaken',async (idPedido)=>{
            SocketB.SendCancelService(idPedido);
        });

        SocketB.SetMethod(req);
        
    }

    static async RemoveSocket(ws:ws, ipAddress:string)
    {
        var myglobal:any=global;
        for(var i=0;i<myglobal.sockets.length;i++)
        {
            if(myglobal.sockets[i].ipAddress==ipAddress)
            {
                var user= await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:myglobal.sockets[i].idUsuario}});
                user.activo=false;
                getManager().getRepository(UsuarioPos).save(user);
                myglobal.sockets.splice(i,1);
            }
        }
    }
    

}