import { createQueryBuilder, getManager } from "typeorm";
import { Vehiculo } from "../entities/Vehiculo";
import { Cliente } from "../entities/Cliente";
import { ElementoRegistro } from "../entities/ElementoRegistro";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Municipio } from "../entities/Municipio";
import { RegistroServicio } from "../entities/RegistroServicio";
import { Servicio } from "../entities/Servicio";
import { TipoVehiculo } from "../entities/TipoVehiculo";
import { TipoElementoRegistro } from "../entities/TipoElementoRegistro";
import { ElementoRegistroRequest } from "../models/ElementoRegistroRequest";
import { RegistroServicioModel } from "../models/RegistroServicioModel";
import { ServicioModel } from "../models/ServicioModel";
import { writeFile, writeFileSync  } from 'fs';
import { Usuario } from "../entities/Usuario";
import { TipoServicio } from "../entities/TipoServicio";
import { NotificationPushBusiness } from "./NotificationPushBusiness";
import { UsuarioPos } from "../entities/UsuarioPos";
import axios from "axios";
import { GoogleMapsResponse } from "../entities/GoogleMapsResponse";
import { Departamento } from "../entities/Departamento";
import { Parametros } from "../entities/Parametros";

export class ServicioBusiness
{
    GoogleApiUrl="https://maps.googleapis.com/maps/api/distancematrix/json?";
    GoogleApiKey="AIzaSyAmcUiWsvsfeLk6_2aLUCXwjuSe4pR2ZL4";
    
    PushB=new NotificationPushBusiness();
    async CrearServicioCliente(servicio:ServicioModel):Promise<Servicio>
    {
        var newServicio:Servicio=new Servicio();
        newServicio.idCliente=servicio.idCliente;
        newServicio.descripcionCarga=servicio.descripcionCarga;
        newServicio.direccionOrigen=servicio.direccionOrigen;
        newServicio.compDirOrigen=servicio.compDirOrigen;
        newServicio.direccionDestino=servicio.direccionDestino;
        newServicio.destinatario=servicio.destinatario;
        newServicio.compDirDestino=servicio.compDirDestino;
        newServicio.idCiudadOrigen=servicio.idCiudadOrigen;
        newServicio.idCiudadDestino=servicio.idCiudadDestino;
        newServicio.estadoServicio=servicio.estadoServicio;
        newServicio.idTipoVehiculo=servicio.idTipoVehiculo;
        newServicio.valor=servicio.valor;
        newServicio.fechaSolicitud=new Date();
        newServicio.latOrigen=servicio.latOrigen;
        newServicio.lonOrigen=servicio.lonOrigen;
        newServicio.latDest=servicio.latDest;
        newServicio.lonDest=servicio.lonDest;
        newServicio.peso=servicio.peso;
        newServicio.cantidad=servicio.cantidad;
        newServicio.programado=servicio.programado;
        newServicio.fechaProgramacion=servicio.fechaProgramacion;
        newServicio.idTipoServicio=servicio.idTipoServicio;//await getManager().getRepository(TipoServicio).findOne({where:{id:servicio.idTipoServicio}});
        newServicio = await getManager().getRepository(Servicio).save(newServicio);

        var registroServicio:RegistroServicio=new RegistroServicio();
        registroServicio.idServicio=newServicio;
        registroServicio.idEstadoServicio=newServicio.estadoServicio;
        registroServicio.observacion="Solicitud nuevo servicio";
        registroServicio.fechaRegistro=newServicio.fechaSolicitud;
        getManager().getRepository(RegistroServicio).save(registroServicio);
        
        return getManager().getRepository(Servicio).findOne({where:{id:newServicio.id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago","registroServicios","idTipoVehiculo","idCliente", "idUsuario", "idUsuario.idPersona", "idUsuario.vehiculos", "idTipoServicio"]});
    }

    async UpdateServicioCliente(servicio:ServicioModel):Promise<Servicio>
    {
        var currentService:Servicio=await getManager().getRepository(Servicio).findOne({where:{id:servicio.id}, relations:["estadoServicio"]});
        currentService.idCliente=servicio.idCliente;

        if(servicio.idUsuario!=null)
        {
            currentService.idUsuario=servicio.idUsuario;
        }
        currentService.descripcionCarga=servicio.descripcionCarga;
        currentService.direccionOrigen=servicio.direccionOrigen;
        currentService.compDirOrigen=servicio.compDirOrigen;
        currentService.direccionDestino=servicio.direccionDestino;
        currentService.compDirDestino=servicio.compDirDestino;
        currentService.idCiudadOrigen=servicio.idCiudadOrigen;
        currentService.idCiudadDestino=servicio.idCiudadDestino;
        currentService.destinatario=servicio.destinatario;
        switch(servicio.estadoServicio.nombre)
        {
            case "Cancelado":
            case "No Procesado":
                if(currentService.estadoServicio.nombre=="Aceptado")
                {
                    servicio.estadoServicio=currentService.estadoServicio;
                    break;
                }
        }
        currentService.estadoServicio=servicio.estadoServicio;
        currentService.idTipoVehiculo=servicio.idTipoVehiculo;
        currentService.valor=servicio.valor;
        currentService.fechaSolicitud=new Date();
        currentService.peso=servicio.peso;
        currentService.cantidad=servicio.cantidad;
        currentService.programado=servicio.programado;
        currentService.fechaProgramacion=servicio.fechaProgramacion;
        currentService.calificacion=servicio.calificacion;
        currentService.idTipoServicio=servicio.idTipoServicio;
        currentService = await getManager().getRepository(Servicio).save(currentService);        
        return getManager().getRepository(Servicio).findOne({where:{id:currentService.id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago","registroServicios","idTipoVehiculo","idCliente", "idUsuario", "idUsuario.idPersona", "idUsuario.vehiculos", "idTipoServicio"]});
    }

    async AddRegistroServicio(registro:RegistroServicioModel)
    {
        var registroServicio:RegistroServicio = new RegistroServicio();
        var servicio = await getManager().getRepository(Servicio).findOne({where:{id:registro.idServicio}, relations:["idCliente","idUsuario", "idUsuario.idPersona", "idUsuario.vehiculos", "idTipoVehiculo"]});
        registroServicio.idServicio = servicio;
        registroServicio.idEstadoServicio = await getManager().getRepository(EstadoServicio).findOne({where:{id:registro.idEstadoServicio}});
        registroServicio.observacion = registro.observacion;
        registroServicio.fechaRegistro = registro.fechaRegistro;
        registroServicio = await getManager().getRepository(RegistroServicio).save(registroServicio);
        servicio.estadoServicio=registroServicio.idEstadoServicio;
        await getManager().getRepository(Servicio).save(servicio);
        var placas="";
        if(servicio.idUsuario.vehiculos.length>0)
            placas = " de placas "+servicio.idUsuario.vehiculos[0].placa;
        switch(servicio.estadoServicio.nombre)
        {
            case "Programado":
                var distance=await this.GetDistance(servicio.latOrigen,servicio.lonOrigen, servicio.latDest,servicio.lonDest);
                var eta="";
                if(distance!=null)
                {
                    eta=" El tiempo estimado de llegada es de "+distance.rows[0].elements[0].duration.text;
                }
                var subTitle:string = "Tu Solicitud está próxima a ser recogida";
                var messageText:string = "Tu Servicio va en camino llevado por "+servicio.idUsuario.idPersona.nombres+ " " + servicio.idUsuario.idPersona.apellidos + " en un vehículo tipo " + servicio.idTipoVehiculo.nombre + placas + ". Dentro de poco estará llegando a tu dirección con tu solicitud." + eta;
                this.PushB.Notificar(servicio.idCliente.id, servicio.id, subTitle,messageText, "onroute");
                break;
            case "Recepcionado":
                var distance=await this.GetDistance(servicio.latOrigen,servicio.lonOrigen, servicio.latDest,servicio.lonDest);
                var eta="";
                if(distance!=null)
                {
                    eta=" El tiempo estimado de llegada es de "+distance.rows[0].elements[0].duration.text;
                }
                var subTitle:string = "Tu Servicio va en camino";
                var messageText:string = "Tu Servicio va en camino llevado por "+servicio.idUsuario.idPersona.nombres+ " "+servicio.idUsuario.idPersona.apellidos+ " en un vehículo tipo " + servicio.idTipoVehiculo.nombre + placas + ". Dentro de poco estará llegando a su destino." + eta;
                this.PushB.Notificar(servicio.idCliente.id, servicio.id, subTitle,messageText,"pickup");
                break;
            case "Entregado":
                var usuarioPos=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:servicio.idUsuario.id}});
                usuarioPos.enEntrega=false;
                getManager().getRepository(UsuarioPos).save(usuarioPos);
                var subTitle:string = "Tu Servicio ha sido entregado";
                var messageText:string = "Tu Servicio ha sido entregado. Gracias por utilizar los servicios de SEApp.";
                this.PushB.Notificar(servicio.idCliente.id, servicio.id, subTitle,messageText,"deliver");
                break;
        }
        return registroServicio;
    }

    async AddElementoRegistro(elemento:ElementoRegistroRequest):Promise<ElementoRegistro>
    {
        var parametro=await getManager().getRepository(Parametros).findOne({where:{parametro:"pathImages"}})
        var path="";
        if(parametro!=null)
        {
            path=parametro.value;
        }
        var registro=await getManager().getRepository(RegistroServicio).findOne({where:{id:elemento.IdRegistroServicio}});
        var tipoElemento=await getManager().getRepository(TipoElementoRegistro).findOne({where:{id:elemento.IdTipoElemento}});
        var newElemento:ElementoRegistro =new ElementoRegistro();
        newElemento.idRegistroServicio=registro;
        newElemento.idTipoElemento=tipoElemento;
        var filename=path+'img'+registro.id+'-'+Date.now()+'.jpg';
        let buff = new Buffer(elemento.elemento.split('-').join('+').split('.').join('='), 'base64');  
        writeFileSync(filename, buff);
        newElemento.elemento=filename;
        newElemento=await getManager().getRepository(ElementoRegistro).save(newElemento);
        return newElemento;
    }

    async GetServicios(estado:string):Promise<Servicio[]>
    {
        var item=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:estado}});
        var servicios=await getManager().getRepository(Servicio).find({where:{estadoServicio:item}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago"]});
        return servicios;
    }

    async GetDistance(latOrg:number, lonOrg:number, latDest:number, lonDest:number)
    {
        var url=this.GoogleApiUrl+"origins="+latOrg+","+lonOrg+"&destinations="+latDest+","+lonDest+"&key="+this.GoogleApiKey;
        var res=await axios.get(url);
        var googleRes:GoogleMapsResponse=res.data;
        return googleRes;
    }

    async GetServiciosByUsuarioActivos(idUsuario:number):Promise<Servicio[]>
    {
        var usuario=await getManager().getRepository(Usuario).findOne({where:{id:idUsuario}});
        var estadoAsignado=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Programado"}});
        var estadoAceptado=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Aceptado"}});
        var estadoRecep=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:"Recepcionado"}});
        var servicios=await getManager().getRepository(Servicio).find({
            where:
            [
                {idUsuario:usuario, estadoServicio:estadoAsignado},
                {idUsuario:usuario, estadoServicio:estadoAceptado},
                {idUsuario:usuario, estadoServicio:estadoRecep}
            ], 
            relations:["idCliente", "idCiudadOrigen", "idCiudadDestino", "idTipoVehiculo", "estadoServicio", "pagos", "pagos.idMedioPago"]
        });
        return servicios;
    }

    async GetServiciosByUsuario(idUsuario:number, estado:string ):Promise<Servicio[]>
    {
        var usuario=await getManager().getRepository(Usuario).findOne({where:{id:idUsuario}});
        if(estado!=null && estado!='')
        {
            var status=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:estado}});
            var servicios=await getManager().getRepository(Servicio).find({where:{idUsuario:usuario, estadoServicio:status }, relations:["idCliente", "idCiudadOrigen", "idCiudadDestino", "idTipoVehiculo", "estadoServicio", "pagos", "pagos.idMedioPago"]});
            return servicios;
        }
        else
        {
            var servicios=await getManager().getRepository(Servicio).find({where:{idUsuario:usuario }, relations:["idCliente", "idCiudadOrigen", "idCiudadDestino", "idTipoVehiculo", "estadoServicio", "pagos", "pagos.idMedioPago"]});
            return servicios;
        }
    }

    async GetServiciosByCliente(idCliente:number):Promise<Servicio[]>
    {
        var res = await getManager().query(`SELECT top 15
        s.Id, 
        s.DireccionOrigen, 
        s.CompDirOrigen,
        s.DireccionDestino,
        s.CompDirDestino,
        s.FechaSolicitud,
        m1.Id idMunicipioOrigen,
        m1.Nombre nombreMunicipioOrigen, 
        m2.Id idMunicipioDestino,
        m2.Nombre nombreMunicipioDestino,
        d1.Id idDeptoOrigen,
        d1.Nombre nombreDeptoOrigen,
        d2.Id idDeptoDestino,
        d2.Nombre nombreDeptoDestino,
        es.Id idEstado,
        es.Nombre Estado,
		s.otp
        from servicio s
        inner join Municipio m1 on s.IdCiudadOrigen = m1.Id 
        inner join Departamento d1 on m1.IdDepartamento = d1.Id 
        inner join Municipio m2 on s.IdCiudadDestino = m2.Id 
        inner join Departamento d2 on m2.IdDepartamento = d2.Id 
        inner join EstadoServicio es on s.EstadoServicio = es.Id 
        where IdCliente = ` + idCliente +` order by FechaSolicitud DESC`);
        var servicios:Servicio[]=new Array(0);
        res.forEach(e => {
            var s:Servicio=new Servicio();
            s.id=e.Id;
            s.direccionOrigen=e.DireccionOrigen;
            s.compDirOrigen=e.CompDirOrigen;
            s.direccionDestino=e.DireccionDestino;
            s.compDirDestino=e.CompDirDestino;
            s.fechaSolicitud=e.FechaSolicitud;
            s.idCiudadOrigen=new Municipio();
            s.idCiudadOrigen.id=e.idMunicipioOrigen;
            s.idCiudadOrigen.nombre=e.nombreMunicipioOrigen;
            s.idCiudadOrigen.idDepartamento=new Departamento();
            s.idCiudadOrigen.idDepartamento.id=e.idDeptoOrigen;
            s.idCiudadOrigen.idDepartamento.nombre=e.nombreDeptoOrigen;
            s.idCiudadDestino=new Municipio();
            s.idCiudadDestino.id=e.idMunicipioDestino;
            s.idCiudadDestino.nombre=e.nombreMunicipioDestino;
            s.idCiudadDestino.idDepartamento=new Departamento();
            s.idCiudadDestino.idDepartamento.id=e.idDeptoDestino;
            s.idCiudadDestino.idDepartamento.nombre=e.nombreDeptoDestino;
            s.estadoServicio=new EstadoServicio();
            s.estadoServicio.id=e.idEstado;
            s.estadoServicio.nombre=e.Estado;
			s.otp=e.otp;
            servicios.push(s);
        });
            //var servicios=await getManager().getRepository(Servicio).find({where:{idCliente:idCliente }});//, relations:["idCliente", "idCiudadOrigen", "idCiudadDestino","idCiudadOrigen.idDepartamento", "idCiudadDestino.idDepartamento", "estadoServicio"]});
            return servicios;
    }

    async GetServicio(id:number):Promise<Servicio>
    {
        var res=await getManager().getRepository(Servicio).findOne({where:{id:id}, relations:["idCiudadOrigen", "idCiudadDestino","idCiudadOrigen.idDepartamento", "idCiudadDestino.idDepartamento", "estadoServicio", "pagos", "pagos.idMedioPago","registroServicios","idTipoVehiculo","idCliente", "idUsuario", "idUsuario.idPersona", "idUsuario.vehiculos", "idTipoServicio"]});
        return res;
    }

}