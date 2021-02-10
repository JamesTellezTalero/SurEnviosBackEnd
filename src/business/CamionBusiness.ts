import { createQueryBuilder, getManager, getRepository } from "typeorm";
import { Camion } from "../entities/Camion";
import { CamionPos } from "../entities/CamionPos";
import { Parametros } from "../entities/Parametros";
import { TipoCamion } from "../entities/TipoCamion";
import { TipoTripulante } from "../entities/TipoTripulante";
import { TipoVinculacion } from "../entities/TipoVinculacion";
import { Tripulante } from "../entities/Tripulante";

export class CamionBusiness
{
    async GetNearOperators(lat:number,lon:number, idTipoCamion:number)
    {
        //console.log(lat+","+lon);
        var distancia = await getManager().getRepository(Parametros).findOne({where:{parametro:"radioBusqueda"}});
        var conductor=await getManager().getRepository(TipoTripulante).findOne({where:{nombre:"Conductor"}});
        var valueDistancia = parseInt(distancia.value);
        var operators = await createQueryBuilder("CamionPos")
        .select("CamionPos")
        .addSelect("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000","distancia")
        .where("activo=:status", { status : 1 })
        .innerJoinAndSelect("CamionPos.idCamion2","Camion")
        .innerJoinAndSelect("Camion.idTipoCamion","TipoCamion")
        .innerJoinAndSelect("Camion.idTipoVinculacion","TipoVinculacion")
        .leftJoinAndSelect("Camion.tripulantes","Tripulante","Tripulante.idTipoTripulante= :tipo",{tipo:conductor.id})
        .leftJoinAndSelect("Tripulante.idTipoTripulante","TipoTripulante")
        .andWhere("enEntrega=:busy", { busy : 0 })
        .andWhere("(6371 * acos(cos(radians(:Lat)) * cos(radians(lat)) * cos(radians(lon) " +
        "- radians(:Long)) + sin(radians(:Lat)) * sin(radians(lat))))*1000  < :distancia",{ Lat:lat, Long:lon,distancia:valueDistancia})
        .andWhere("Camion.idTipoCamion=:tipoCamion",{tipoCamion:idTipoCamion})
        .getMany();
        return operators;
    }
}
