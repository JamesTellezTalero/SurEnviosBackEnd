import { getManager } from "typeorm";
import { Cliente } from "../entities/Cliente";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Municipio } from "../entities/Municipio";
import { RegistroServicio } from "../entities/RegistroServicio";
import { Servicio } from "../entities/Servicio";
import { TipoCamion } from "../entities/TipoCamion";
import { RegistroServicioModel } from "../models/RegistroServicioModel";
import { ServicioModel } from "../models/ServicioModel";

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
        newServicio.idTipoCamion=await getManager().getRepository(TipoCamion).findOne({where:{id:servicio.idTipoCamion}});
        newServicio.valor=servicio.valor;
        newServicio.fechaSolicitud=new Date();
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
        currentService.descripcionCarga=servicio.descripcionCarga;
        currentService.direccionOrigen=servicio.direccionOrigen;
        currentService.direccionDestino=servicio.direccionDestino;
        currentService.idCiudadOrigen=ciudadOrigen;
        currentService.idCiudadDestino=ciudadDestino;
        currentService.estadoServicio=await getManager().getRepository(EstadoServicio).findOne({where:{id:servicio.estadoServicio}});
        currentService.idTipoCamion=await getManager().getRepository(TipoCamion).findOne({where:{id:servicio.idTipoCamion}});
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
        getManager().getRepository(RegistroServicio).save(registroServicio);
        servicio.estadoServicio=registroServicio.idEstadoServicio;
        var servicio=await getManager().getRepository(Servicio).save(servicio);
        return servicio;
    }

    async GetServicios(estado:string):Promise<Servicio[]>
    {
        var item=await getManager().getRepository(EstadoServicio).findOne({where:{nombre:estado}});
        var servicios=await getManager().getRepository(Servicio).find({where:{estadoServicio:item}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago"]});
        return servicios;
    }

    async GetServicio(id:number):Promise<Servicio>
    {
        var res=await getManager().getRepository(Servicio).findOne({where:{id:id}, relations:["idCiudadOrigen", "idCiudadDestino", "estadoServicio", "pagos", "pagos.idMedioPago","registroServicios","idTipoCamion","idCliente"]});
        return res;
    }

}