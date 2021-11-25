import { createQueryBuilder, getManager, getRepository } from "typeorm";
import { Vehiculo } from "../entities/Vehiculo";
import { UsuarioPos } from "../entities/UsuarioPos";
import { Parametros } from "../entities/Parametros";
import { TipoVehiculo } from "../entities/TipoVehiculo";
import { TipoTripulante } from "../entities/TipoTripulante";
import { TipoVinculacion } from "../entities/TipoVinculacion";
import { Usuario } from "../entities/Usuario";
//import { Tripulante } from "../entities/Tripulante";

export class VehiculoBusiness
{
    async GetNearOperators(lat:number,lon:number, idTipoVehiculo:number)
    {
        //console.log(lat+","+lon);
        var distancia = await getManager().getRepository(Parametros).findOne({where:{parametro:"radioBusqueda"}});
        var conductor=await getManager().getRepository(TipoTripulante).findOne({where:{nombre:"Conductor"}});
        var valueDistancia = parseInt(distancia.value);
        var operators = await createQueryBuilder("UsuarioPos")
        .select("UsuarioPos")
        .addSelect("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000","distancia")
        .where("activo=:status", { status : 1 })
        .innerJoinAndSelect("UsuarioPos.idVehiculo2","Vehiculo")
        .innerJoinAndSelect("Vehiculo.idTipoVehiculo","TipoVehiculo")
        .innerJoinAndSelect("Vehiculo.idTipoVinculacion","TipoVinculacion")
        .leftJoinAndSelect("Vehiculo.tripulantes","Tripulante","Tripulante.idTipoTripulante= :tipo",{tipo:conductor.id})
        .leftJoinAndSelect("Tripulante.idTipoTripulante","TipoTripulante")
        .andWhere("enEntrega=:busy", { busy : 0 })
        .andWhere("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000  < :distancia",{ Lat:lat, Long:lon,distancia:valueDistancia})
        .andWhere("Vehiculo.idTipoVehiculo=:tipoVehiculo",{tipoVehiculo:idTipoVehiculo})
        .getMany();
        return operators;
    }

    async GetVehiculoById(id:number)
    {
        var Vehiculo=await getManager().getRepository(Vehiculo).findOne(
        {
            where:{id:id},
            relations:["idTipoVehiculo","idTipoVinculacion","propietario","UsuarioPos","tripulantes"]
        });
        return Vehiculo;
    } 
    
    async CreateVehiculo(newVehiculo:Vehiculo)
    {
        var exist = await getManager().getRepository(Vehiculo).findOne({where : {placa : newVehiculo.placa}});
        if(exist!=null)
            return null;
        var data = await getManager().getRepository(Vehiculo).save(newVehiculo);
        return this.GetVehiculoById(data.id);
    }

    
}
