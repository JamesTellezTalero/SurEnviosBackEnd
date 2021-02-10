import { ClientRequest } from "http";
import { ConnectionOptions } from "typeorm";
import { Camion } from "./entities/Camion";
import { CamionPos } from "./entities/CamionPos";
import { CategoriaCamion } from "./entities/CategoriaCamion";
import { Cliente } from "./entities/Cliente";
import { Departamento } from "./entities/Departamento";
import { EstadoServicio } from "./entities/EstadoServicio";
import { Municipio } from "./entities/Municipio";
import { Pago } from "./entities/Pago";
import { Propietario } from "./entities/Propietario";
import { Regional } from "./entities/Regional";
import { RegistroServicio } from "./entities/RegistroServicio";
import { Servicio } from "./entities/Servicio";
import { TipoCamion } from "./entities/TipoCamion";
import { TipoDocumento } from "./entities/TipoDocumento";
import { TipoPago } from "./entities/TipoPago";
import { TipoTripulante } from "./entities/TipoTripulante";
import { TipoVinculacion } from "./entities/TipoVinculacion";
import { Tripulante } from "./entities/Tripulante";
import { Usuario } from "./entities/Usuario";
import { Parametros } from "./entities/Parametros";
const dbConfig: ConnectionOptions = {
    type: "mssql",
    host: "rationalsoftware.ddns.net",
    port: 1433,
    username: "sa",
    password: "$lcs1648_*",
    database: "SurEnvios",
    schema: "dbo",
    entities: [
      Camion,
      CamionPos,
      CategoriaCamion,
      Cliente,
      Departamento,
      EstadoServicio,
      Municipio,
      Pago,
      Parametros,
      Propietario,
      Regional,
      RegistroServicio,
      Servicio,
      TipoCamion,
      TipoDocumento,
      TipoPago,
      TipoTripulante,
      TipoVinculacion,
      Tripulante,
      Usuario
    ],
    synchronize: false,
    logging: false,
    
}

export { dbConfig };
