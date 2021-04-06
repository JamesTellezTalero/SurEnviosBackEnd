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

export class ServicioBusiness
{
    async CrearServicioCliente(servicio:ServicioModel):Promise<Servicio>
    {
        var newServicio:Servicio=new Servicio();
        newServicio.idCliente=await getManager().getRepository(Cliente).findOne({where:{id:servicio.idCliente}});
        var ciudadOrigen=await getManager().getRepository(Municipio).findOne(
        {
            where:{id:servicio.idCiudadOrigen},
            relations:["idDepartamento"]
        });
        var ciudadDestino=await getManager().getRepository(Municipio).findOne(
        {
            where:{id:servicio.idCiudadDestino},
            relations:["idDepartamento"]
        });
        newServicio.descripcionCarga=servicio.descripcionCarga;
        newServicio.direccionOrigen=servicio.direccionOrigen;
        newServicio.direccionDestino=servicio.direccionDestino;
        newServicio.idCiudadOrigen=ciudadOrigen;
        newServicio.idCiudadDestino=ciudadDestino;
        newServicio.estadoServicio=await getManager().getRepository(EstadoServicio).findOne({where:{id:servicio.estadoServicio}});
        newServicio.idTipoVehiculo=await getManager().getRepository(TipoVehiculo).findOne({where:{id:servicio.idTipoVehiculo}});
        newServicio.valor=servicio.valor;
        newServicio.fechaSolicitud=new Date();
        newServicio.latOrigen=servicio.latOrigen;
        newServicio.lonOrigen=servicio.lonOrigen;
        newServicio.latDest=servicio.latDest;
        newServicio.lonDest=servicio.lonDest;
        newServicio.idTipoServicio=await getManager().getRepository(TipoServicio).findOne({where:{id:servicio.idTipoServicio}});
        newServicio = await getManager().getRepository(Servicio).save(newServicio);

        var registroServicio:RegistroServicio=new RegistroServicio();
        registroServicio.idServicio=newServicio;
        registroServicio.idEstadoServicio=newServicio.estadoServicio;
        registroServicio.observacion="Solicitud nuevo servicio";
        registroServicio.fechaRegistro=newServicio.fechaSolicitud;
        getManager().getRepository(RegistroServicio).save(registroServicio);
        
        return getManager().getRepository(Servicio).findOne({where:{id:newServicio.id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago"]});
    }

    async UpdateServicioCliente(servicio:ServicioModel):Promise<Servicio>
    {
        var currentService:Servicio=await getManager().getRepository(Servicio).findOne({where:{id:servicio.id}});
        currentService.idCliente=await getManager().getRepository(Cliente).findOne({where:{id:servicio.idCliente}});
        var ciudadOrigen=await getManager().getRepository(Municipio).findOne(
        {
            where:{id:servicio.idCiudadOrigen},
            relations:["idDepartamento"]
        });
        var ciudadDestino=await getManager().getRepository(Municipio).findOne(
        {
            where:{id:servicio.idCiudadDestino},
            relations:["idDepartamento"]
        });
        if(servicio.idUsuario!=null)
        {
            var Usuario=await getManager().getRepository(Usuario).findOne({where:{id:servicio.idUsuario}});
            if(Vehiculo!=null)
            {
                currentService.idUsuario=Usuario;
            }
        }
        currentService.descripcionCarga=servicio.descripcionCarga;
        currentService.direccionOrigen=servicio.direccionOrigen;
        currentService.direccionDestino=servicio.direccionDestino;
        currentService.idCiudadOrigen=ciudadOrigen;
        currentService.idCiudadDestino=ciudadDestino;
        currentService.estadoServicio=await getManager().getRepository(EstadoServicio).findOne({where:{id:servicio.estadoServicio}});
        currentService.idTipoVehiculo=await getManager().getRepository(TipoVehiculo).findOne({where:{id:servicio.idTipoVehiculo}});
        currentService.valor=servicio.valor;
        currentService.fechaSolicitud=new Date();
        currentService = await getManager().getRepository(Servicio).save(currentService);        
        return getManager().getRepository(Servicio).findOne({where:{id:currentService.id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago"]});
    }

    async AddRegistroServicio(registro:RegistroServicioModel)
    {
        var registroServicio:RegistroServicio = new RegistroServicio();
        var servicio = await getManager().getRepository(Servicio).findOne({where:{id:registro.idServicio}});
        registroServicio.idServicio = servicio;
        registroServicio.idEstadoServicio = await getManager().getRepository(EstadoServicio).findOne({where:{id:registro.idEstadoServicio}});
        registroServicio.observacion = registro.observacion;
        registroServicio.fechaRegistro = registro.fechaRegistro;
        registroServicio = await getManager().getRepository(RegistroServicio).save(registroServicio);
        servicio.estadoServicio=registroServicio.idEstadoServicio;
        await getManager().getRepository(Servicio).save(servicio);
        return registroServicio;
    }

    async AddElementoRegistro(elemento:ElementoRegistroRequest):Promise<ElementoRegistro>
    {
        var registro=await getManager().getRepository(RegistroServicio).findOne({where:{id:elemento.IdRegistroServicio}});
        var tipoElemento=await getManager().getRepository(TipoElementoRegistro).findOne({where:{id:elemento.IdTipoElemento}});
        var newElemento:ElementoRegistro =new ElementoRegistro();
        newElemento.idRegistroServicio=registro;
        newElemento.idTipoElemento=tipoElemento;
        var filename='img'+registro.id+'-'+Date.now()+'.jpg';
        writeFileSync(filename, elemento.elemento);
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

    async GetServicio(id:number):Promise<Servicio>
    {
        var res=await getManager().getRepository(Servicio).findOne({where:{id:id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago","registroServicios","idTipoVehiculo","idCliente"]});
        return res;
    }

}