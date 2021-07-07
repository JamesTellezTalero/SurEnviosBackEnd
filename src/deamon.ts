import * as ws from 'ws';
import { Between, createConnection, getManager } from "typeorm";
import { dbConfig } from "./dbConfig";
import { SocketModel, SocketParameter } from "./models/SocketModel";
import { SocketBusiness } from './socket/SocketBusiness';
import { Servicio } from './entities/Servicio';
import { EstadoServicio } from './entities/EstadoServicio';

const SocketB=new SocketBusiness();

console.log("Iniciando");
createConnection(dbConfig).then(async()=>{
    while(true)
    {
        var date=new Date();
        var minutes=date.getMinutes();
        if(minutes==0 || minutes==15 || minutes==30 || minutes==45)
            StartProcess(date);
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    
}).catch(error =>{ 
    console.log(error);
});

async function StartProcess(date:Date) {
    
    var estado=getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Solicitado"}});
    var services=await getManager().getRepository(Servicio).find({where:{
        programado:true,
        estadoServicio:estado,
        fechaProgramacion:date
    }});
    services.forEach(servicio => {
        SocketB.removeAllListeners();
        SocketB.on('SendServicio', (idUser, servicio)=>{
            var myglobal:any = global;
            var item=myglobal.sockets.find(m => m.idUsuario == idUser);
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
    });
    
}
