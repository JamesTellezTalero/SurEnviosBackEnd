import { ClientRequest } from "http";
import { ConnectionOptions } from "typeorm";
import { Vehiculo } from "./entities/Vehiculo";
import { UsuarioPos } from "./entities/UsuarioPos";
import { CategoriaVehiculo } from "./entities/CategoriaVehiculo";
import { Cliente } from "./entities/Cliente";
import { Departamento } from "./entities/Departamento";
import { EstadoServicio } from "./entities/EstadoServicio";
import { Municipio } from "./entities/Municipio";
import { Pago } from "./entities/Pago";
import { Propietario } from "./entities/Propietario";
import { Regional } from "./entities/Regional";
import { RegistroServicio } from "./entities/RegistroServicio";
import { Servicio } from "./entities/Servicio";
import { TipoVehiculo } from "./entities/TipoVehiculo";
import { TipoDocumento } from "./entities/TipoDocumento";
import { TipoPago } from "./entities/TipoPago";
import { TipoTripulante } from "./entities/TipoTripulante";
import { TipoVinculacion } from "./entities/TipoVinculacion";

import { Usuario } from "./entities/Usuario";
import { Parametros } from "./entities/Parametros";
import { ElementoRegistro } from "./entities/ElementoRegistro";
import { TipoElementoRegistro } from "./entities/TipoElementoRegistro";
import { Perfil } from "./entities/Perfil";
import { Persona } from "./entities/Persona";
import { TipoServicio } from "./entities/TipoServicio";
import { TripulanteVehiculo } from "./entities/TripulanteVehiculo";
import { PushNotificationData } from "./entities/PushNotificationData";
import { UsuarioRequest } from "./entities/UsuarioRequest";

const dbConfig: ConnectionOptions = {
    type: "mssql",
    host: "rationalsoftware.ddns.net",
    port: 1433,
    username: "sa",
    password: "$lcs1648_*",
    maxQueryExecutionTime:120000,
    database: "SurEnvios",
    schema: "dbo",
    entities: [
      CategoriaVehiculo,
      Cliente,
      Departamento,
      ElementoRegistro,
      EstadoServicio,
      Municipio,
      Pago,
      Parametros,
      Perfil,
      Persona,
      Propietario,
      PushNotificationData,
      Regional,
      RegistroServicio,
      Servicio,
      TipoDocumento,
      TipoElementoRegistro,
      TipoPago,
      TipoServicio,
      TipoTripulante,
      TipoVehiculo,
      TipoVinculacion,
      TripulanteVehiculo,
      Usuario,
      UsuarioPos,
      UsuarioRequest,
      Vehiculo,
    ],
    synchronize: false,
    logging: false,
    
}

export { dbConfig };
